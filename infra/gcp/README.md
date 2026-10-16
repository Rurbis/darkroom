# Google Cloud

The NestJS API runs on **Cloud Run** in `us-east4`, next to Supabase `us-east-1` (D56, D63). Files never go through Google: the API signs R2 URLs and browsers upload and download straight from R2, where egress is free.

The project lives in the organization Google created with the billing account. New organizations enforce secure-by-default policies, and three of them shape this setup:

- **No service account keys can be created or uploaded**, which enforces D105 at the platform level.
- **Default service accounts get no roles.** Every workload here (API, deployer, billing guard, function build) has its own service account with only the roles it needs.
- **Domain restricted sharing**: roles can only go to identities of the organization. External accounts (personal Gmail) and `allUsers` are rejected. Both owners use the platform account, and the API is made public with Cloud Run's `--no-invoker-iam-check` instead of granting `allUsers` (issue #16).

## What `bootstrap.sh` sets up

| Piece                                                                  | Why                                                                                                                                                                                                                                                                 |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Artifact Registry `focaldrop` (Docker, `us-east4`)                     | Stores the API images that Cloud Run runs. A cleanup policy keeps the 5 most recent and every `v*` release, and deletes the rest after 30 days, to stay inside the 0.5 GB free tier.                                                                                |
| `focaldrop-api-runtime` service account                                | Identity of the API in Cloud Run, with no roles yet.                                                                                                                                                                                                                |
| `github-deployer` service account                                      | What GitHub Actions impersonates to deploy. It can deploy Cloud Run services (`run.developer`), push to this repository only and act as the runtime account only.                                                                                                   |
| Workload Identity Federation: pool `github`, provider `github-actions` | GitHub signs a short-lived token saying which repository a workflow belongs to; Google verifies it and grants temporary access. There is no long-lived key to leak (D105).                                                                                          |
| Billing guard: topic `billing-alerts` and function `billing-guard`     | Turns the budget into a hard cap. When a budget notification reports a cost above the budget, the function unlinks the billing account, which stops every service in the project. Its account can only manage billing on this project and read the billing account. |
| `function-builder` service account                                     | Identity Cloud Build uses to build the billing guard (`cloudbuild.builds.builder`).                                                                                                                                                                                 |

**Access is granted by immutable IDs.** Repository `1414983088` of owner `263442215` instead of `Rurbis/focaldrop`: names can be renamed (this repository was `darkroom`) or reused after a deletion, IDs cannot.

**No service account keys.** The script fails if any user-managed key exists.

## Run it

In [Cloud Shell](https://shell.cloud.google.com), signed in with the platform account:

```bash
git clone https://github.com/Rurbis/focaldrop.git
cd focaldrop
PROJECT_ID=focaldrop bash infra/gcp/bootstrap.sh
```

It is safe to run again. At the end it prints the values that issue #16 stores as GitHub Environment variables. They are identifiers, not secrets.

## Cost protection (D87)

Three layers, because a budget on its own only sends emails:

1. **`max-instances = 2`** on the Cloud Run service (issue #16) bounds how far traffic can scale it.
2. **A US$5/month budget** (MX$100, the billing account is in MXN) with alerts at 50, 90 and 100 %, set in the console on the paid account. Credits are excluded, so it measures real usage.
3. **The billing guard** cuts billing when the budget is exceeded. Budget notifications arrive with a delay of a few hours, so the real ceiling is slightly above US$5.

Cutting billing stops the API, and Google warns that resources may be deleted. That is acceptable here: no data lives in Google Cloud (the database is Supabase and files are R2), and CI can redeploy the API. To recover, link the billing account again in the console.

### Test the guard

```bash
# Under budget: the logs say "No action".
gcloud pubsub topics publish billing-alerts --message='{"budgetDisplayName":"test","costAmount":1,"budgetAmount":5}'
# Over budget: billing is disabled.
gcloud pubsub topics publish billing-alerts --message='{"budgetDisplayName":"test","costAmount":10,"budgetAmount":5}'
gcloud functions logs read billing-guard --region=us-east4 --limit=10
gcloud billing projects describe "$PROJECT_ID" --format='value(billingEnabled)'
# Then link the billing account again in the console (Billing > Link a billing account).
```

### Billing guard dependencies

`billing-guard/package.json` overrides `uuid` to 11.1.1. `cloudevents` 10.0.0, pulled in by `@google-cloud/functions-framework` 5.0.5 (both are the latest versions), still asks for `uuid@^8.3.2`, which Dependabot flags (GHSA-w5hq-g745-h8pq) and cannot update. The flaw only affects `v3`, `v5` and `v6` called with a `buf` argument; `cloudevents` only calls `v4()`, and 11.1.1 still ships the CommonJS build it loads. Remove the override once `cloudevents` accepts `uuid` 11.1.1 or later. Dependency changes reach the deployed function the next time `bootstrap.sh` runs.

## Not here

- **Billing and budget** are set in the console. After the script runs, connect the budget to the `billing-alerts` topic (_Manage notifications_).
- **The Cloud Run service** is created by the first deploy (issue #16). Making the API public (`--no-invoker-iam-check`) is a one-time manual step there, so the deployer never needs that permission.
