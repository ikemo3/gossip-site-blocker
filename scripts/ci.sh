#!/bin/bash -eu

PACKAGE_VERSION=$(jq -r .version package.json)
echo "PACKAGE_VERSION: ${PACKAGE_VERSION}"

MANIFEST_VERSION=$(jq -r .version apps/manifest.json)
echo "MANIFEST_VERSION: ${MANIFEST_VERSION}"

if [[ "${MANIFEST_VERSION}" != "${PACKAGE_VERSION}" ]]; then
  echo "manifest_version != package_version"
  echo "manifest(chrome): ${MANIFEST_VERSION}"
  echo "package : ${PACKAGE_VERSION}"
  exit 1
fi

FIREFOX_MANIFEST_VERSION=$(jq -r .version apps/manifest.firefox.json)
echo "FIREFOX_MANIFEST_VERSION: ${FIREFOX_MANIFEST_VERSION}"

if [[ "${FIREFOX_MANIFEST_VERSION}" != "${PACKAGE_VERSION}" ]]; then
  echo "manifest_version != package_version"
  echo "manifest(firefox): ${FIREFOX_MANIFEST_VERSION}"
  echo "package : ${PACKAGE_VERSION}"
  exit 1
fi

yarn install
yarn lint-for-ci
yarn lint:deps
yarn test

yarn build
yarn archive
