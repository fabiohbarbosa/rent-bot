#!/usr/bin/env bash
set -e # ensure that this script will return a non-0 status code if any of rhe commands fail
set -o pipefail # ensure that this script will return a non-0 status code if any of rhe commands fail

echo "Configure git to push tag and increase project version"
rm -rf ${HOME}/.gitconfig
git config --global push.default simple
git config --global user.name "CircleCI - ${GITHUB_USER}"
git config --global user.email ${GITHUB_USER}
git remote add circleci https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${GITHUB_REPONAME}.git

echo "Ensure there isn't changes package json files"
git checkout package.json package-lock.json

echo "Patch version"
npm version patch -m "[skip ci] prepare release ${GITHUB_REPONAME}-%s"

echo "Sync master changes"
git pull circleci master

echo "Push changes"
git push circleci master --tags

echo "Save version in VERSION file"
node -p -e 'require(`./package.json`).version' > VERSION
