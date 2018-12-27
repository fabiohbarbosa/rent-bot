#!/usr/bin/env bash
set -e # ensure that this script will return a non-0 status code if any of rhe commands fail
set -o pipefail # ensure that this script will return a non-0 status code if any of rhe commands fail

# Auth on GCP
set_gcp_auth() {
  GOOGLE_AUTH=$1
  echo ${GOOGLE_AUTH} > ${HOME}/gcp-key.json && gcloud auth activate-service-account --key-file ${HOME}/gcp-key.json
  gcloud auth configure-docker --quiet
}

VERSION=$(head -n 1 VERSION) # load ${VERSION} from VERSION file

echo "Build application docker image version ${VERSION}"
docker build -t gcr.io/${CLOUD}/${GROUP}/${SERVICENAME}:${VERSION} .
echo "gcr.io/${CLOUD}/${GROUP}/${SERVICENAME}:${VERSION} builded!"

echo "Push docker image to GCP registry"
set_gcp_auth "${GOOGLE_AUTH}"
docker push gcr.io/${CLOUD}/${GROUP}/${SERVICENAME}:${VERSION}
echo "gcr.io/${CLOUD}/${GROUP}/${SERVICENAME}:${VERSION} pushed!"
