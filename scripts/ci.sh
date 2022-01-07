#!/bin/bash -eu

PACKAGE_VERSION=$(jq -r .version package.json)
echo "PACKAGE_VERSION: ${PACKAGE_VERSION}"

MANIFEST_VERSION=$(jq -r .version apps/manifest.json)
echo "MANIFEST_VERSION: ${MANIFEST_VERSION}"

if [[ "${MANIFEST_VERSION}" != "${PACKAGE_VERSION}" ]]; then
  echo "manifest_version != package_version"
  echo "manifest: ${MANIFEST_VERSION}"
  echo "package : ${PACKAGE_VERSION}"
  exit 1
fi

yarn install
yarn lint-for-ci
yarn test

yarn build
yarn archive
