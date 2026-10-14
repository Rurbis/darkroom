#!/usr/bin/env bash
# One-time setup of the Google Cloud project that hosts the API (issue #7).
# Run it in Cloud Shell, signed in with the platform account:
#
#   PROJECT_ID=focaldrop bash infra/gcp/bootstrap.sh
#
# It is safe to run again: every step checks what already exists.
# Creates no keys: GitHub Actions authenticates through Workload Identity
# Federation (D105). Details and reasons are in README.md next to this file.
set -euo pipefail

: "${PROJECT_ID:?Set PROJECT_ID, for example: PROJECT_ID=focaldrop bash infra/gcp/bootstrap.sh}"

REGION='us-east4'                # Next to Supabase us-east-1 (D41, D63)
AR_REPO='focaldrop'              # Artifact Registry repository for the API images
POOL='github'                    # Workload Identity pool
PROVIDER='github-actions'        # OIDC provider inside the pool
# Immutable GitHub IDs of Rurbis/focaldrop. Names can be renamed or reused;
# IDs cannot, so access is granted by ID.
GITHUB_REPO_ID='1414983088'
GITHUB_OWNER_ID='263442215'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUNTIME_SA="focaldrop-api-runtime@${PROJECT_ID}.iam.gserviceaccount.com"
DEPLOYER_SA="github-deployer@${PROJECT_ID}.iam.gserviceaccount.com"

step() { printf '\n==> %s\n' "$1"; }

step "Project ${PROJECT_ID}"
gcloud config set project "${PROJECT_ID}" --quiet
PROJECT_NUMBER="$(gcloud projects describe "${PROJECT_ID}" --format='value(projectNumber)')"
echo "Project number: ${PROJECT_NUMBER}"

step 'Enabling APIs'
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  iam.googleapis.com \
  iamcredentials.googleapis.com \
  sts.googleapis.com \
  cloudresourcemanager.googleapis.com

step "Artifact Registry repository ${AR_REPO} (${REGION})"
if ! gcloud artifacts repositories describe "${AR_REPO}" --location="${REGION}" >/dev/null 2>&1; then
  gcloud artifacts repositories create "${AR_REPO}" \
    --repository-format=docker \
    --location="${REGION}" \
    --description='Container images of the Focal Drop API'
fi
# Keeps the 0.5 GB free tier: old images are deleted, recent and release ones kept.
gcloud artifacts repositories set-cleanup-policies "${AR_REPO}" \
  --location="${REGION}" \
  --policy="${SCRIPT_DIR}/artifact-cleanup-policy.json" \
  --no-dry-run

step 'Service accounts'
create_sa() {
  local email="$1" display="$2"
  if ! gcloud iam service-accounts describe "${email}" >/dev/null 2>&1; then
    gcloud iam service-accounts create "${email%%@*}" --display-name="${display}"
  fi
}
# Identity of the API in Cloud Run. Without it Cloud Run would use the default
# compute account, which has Editor on the whole project.
create_sa "${RUNTIME_SA}" 'Focal Drop API (Cloud Run runtime)'
# Identity that GitHub Actions impersonates to deploy.
create_sa "${DEPLOYER_SA}" 'GitHub Actions deployer'

step 'Least-privilege roles for the deployer'
# Deploy Cloud Run services. It cannot change who may invoke them: making the
# API public is a one-time manual step in issue #16.
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${DEPLOYER_SA}" \
  --role='roles/run.developer' \
  --condition=None >/dev/null
# Push images to this repository only.
gcloud artifacts repositories add-iam-policy-binding "${AR_REPO}" \
  --location="${REGION}" \
  --member="serviceAccount:${DEPLOYER_SA}" \
  --role='roles/artifactregistry.writer' >/dev/null
# Deploy revisions that run as the runtime account, and only that account.
gcloud iam service-accounts add-iam-policy-binding "${RUNTIME_SA}" \
  --member="serviceAccount:${DEPLOYER_SA}" \
  --role='roles/iam.serviceAccountUser' >/dev/null

step "Workload Identity Federation (${POOL}/${PROVIDER})"
if ! gcloud iam workload-identity-pools describe "${POOL}" --location=global >/dev/null 2>&1; then
  gcloud iam workload-identity-pools create "${POOL}" \
    --location=global \
    --display-name='GitHub Actions'
fi
if ! gcloud iam workload-identity-pools providers describe "${PROVIDER}" \
  --location=global --workload-identity-pool="${POOL}" >/dev/null 2>&1; then
  gcloud iam workload-identity-pools providers create-oidc "${PROVIDER}" \
    --location=global \
    --workload-identity-pool="${POOL}" \
    --display-name='Rurbis/focaldrop' \
    --issuer-uri='https://token.actions.githubusercontent.com' \
    --attribute-mapping='google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.repository_id=assertion.repository_id,attribute.repository_owner_id=assertion.repository_owner_id' \
    --attribute-condition="assertion.repository_owner_id == '${GITHUB_OWNER_ID}' && assertion.repository_id == '${GITHUB_REPO_ID}'"
fi
# Only workflows of this repository may impersonate the deployer.
gcloud iam service-accounts add-iam-policy-binding "${DEPLOYER_SA}" \
  --role='roles/iam.workloadIdentityUser' \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL}/attribute.repository_id/${GITHUB_REPO_ID}" >/dev/null

step 'Checking that no service account keys exist'
for sa in "${RUNTIME_SA}" "${DEPLOYER_SA}"; do
  keys="$(gcloud iam service-accounts keys list --iam-account="${sa}" --managed-by=user --format='value(name)')"
  if [[ -n "${keys}" ]]; then
    echo "ERROR: ${sa} has user-managed keys. Delete them: this project uses WIF only." >&2
    exit 1
  fi
done
echo 'OK: no user-managed keys.'

PROVIDER_NAME="$(gcloud iam workload-identity-pools providers describe "${PROVIDER}" \
  --location=global --workload-identity-pool="${POOL}" --format='value(name)')"

step 'Done. Values for the GitHub Environments (issue #16) and Bitwarden'
cat <<EOF
GCP_PROJECT_ID=${PROJECT_ID}
GCP_PROJECT_NUMBER=${PROJECT_NUMBER}
GCP_REGION=${REGION}
GCP_ARTIFACT_REPOSITORY=${REGION}-docker.pkg.dev/${PROJECT_ID}/${AR_REPO}
GCP_WIF_PROVIDER=${PROVIDER_NAME}
GCP_DEPLOYER_SA=${DEPLOYER_SA}
GCP_RUNTIME_SA=${RUNTIME_SA}
EOF
