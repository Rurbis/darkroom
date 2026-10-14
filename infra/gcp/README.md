# Google Cloud

The NestJS API runs on **Cloud Run** in `us-east4`, next to Supabase `us-east-1` (D56, D63). Files never go through Google: the API signs R2 URLs and browsers upload and download straight from R2, where egress is free.

## What `bootstrap.sh` sets up

| Piece                                                                  | Why                                                                                                                                                                                  |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Artifact Registry `focaldrop` (Docker, `us-east4`)                     | Stores the API images that Cloud Run runs. A cleanup policy keeps the 5 most recent and every `v*` release, and deletes the rest after 30 days, to stay inside the 0.5 GB free tier. |
| `focaldrop-api-runtime` service account                                | Identity of the API in Cloud Run, with no roles yet. Without it, Cloud Run would use the default compute account, which has Editor on the whole project.                             |
| `github-deployer` service account                                      | What GitHub Actions impersonates to deploy. It can deploy Cloud Run services (`run.developer`), push to this repository only and act as the runtime account only.                    |
| Workload Identity Federation: pool `github`, provider `github-actions` | GitHub signs a short-lived token saying which repository a workflow belongs to; Google verifies it and grants temporary access. There is no long-lived key to leak (D105).           |

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

## Not here

- **Billing and budget** are set in the console: a US$5/month budget with alerts at 50, 90 and 100 % (D87). A budget only alerts; the hard limit is `max-instances = 2` on the Cloud Run service.
- **The Cloud Run service** is created by the first deploy (issue #16). Making the API public (`roles/run.invoker` for `allUsers`) is a one-time manual step there, so the deployer never needs permission to change IAM policies.
