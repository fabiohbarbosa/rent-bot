#!/usr/bin/env bash
set -e # ensure that this script will return a non-0 status code if any of rhe commands fail
set -o pipefail # ensure that this script will return a non-0 status code if any of rhe commands fail

SCRIPTS_PATH=.circleci/scripts
export VERSION=$(head -n 1 VERSION) # load $VERSION from VERSION file

# Step 1
echo ${GOOGLE_AUTH} > ${HOME}/gcp-key.json
gcloud auth activate-service-account --key-file ${HOME}/gcp-key.json
gcloud auth configure-docker --quiet

# Step 2
echo "Set kubernetes cluster"
gcloud config set container/use_client_certificate True
gcloud container clusters get-credentials ${CLUSTER} --zone ${CLUSTER_ZONE} --project ${CLOUD}

# Step 3
echo "Create kubernetes deploy file"
bash ${SCRIPTS_PATH}/kubectl_file.sh

# Step 4
echo "Kubernetes deploy"
kubectl apply -f service.yaml
