// Billing guard (D87, issue #7): turns the monthly budget into a hard cap.
// The budget publishes its notifications to Pub/Sub; when the cost goes over
// the budget, this function unlinks the billing account, which stops every
// service in the project. Google Cloud only hosts the API (no data lives
// here), so nothing is lost that CI cannot redeploy.
import { CloudBillingClient } from '@google-cloud/billing';
import * as functions from '@google-cloud/functions-framework';

const projectName = `projects/${process.env.GOOGLE_CLOUD_PROJECT}`;
const billing = new CloudBillingClient();

function readNotification(event) {
  try {
    const data = Buffer.from(event.data?.message?.data ?? '', 'base64').toString('utf8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

functions.cloudEvent('stopBilling', async (event) => {
  const notification = readNotification(event);
  if (!notification) {
    // A malformed message is ignored instead of thrown, so it is not retried forever.
    console.warn('Ignored: the message is not a budget notification.');
    return;
  }

  const { budgetDisplayName, costAmount, budgetAmount } = notification;
  if (!(costAmount > budgetAmount)) {
    console.log(`Budget "${budgetDisplayName}": ${costAmount} of ${budgetAmount}. No action.`);
    return;
  }

  const [info] = await billing.getProjectBillingInfo({ name: projectName });
  if (!info.billingEnabled) {
    console.log(`Billing is already disabled for ${projectName}.`);
    return;
  }

  await billing.updateProjectBillingInfo({
    name: projectName,
    projectBillingInfo: { billingAccountName: '' },
  });
  console.error(
    `Budget "${budgetDisplayName}" exceeded (${costAmount} > ${budgetAmount}): billing disabled for ${projectName}.`,
  );
});
