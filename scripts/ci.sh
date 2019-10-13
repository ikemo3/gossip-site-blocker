#!/bin/bash -eu

yarn install
yarn run tsc
yarn lint
yarn test

PACKAGE_NAME=$(jq -r .name package.json)
echo "Archive ${PACKAGE_NAME}.crx"
mkdir -p /tmp/workspace
echo ${PEM_BASE64} | openssl enc -d -base64 -A > /tmp/${PACKAGE_NAME}.pem
yarn crx pack -o /tmp/workspace/${PACKAGE_NAME}.crx apps -p /tmp/${PACKAGE_NAME}.pem
yarn crx pack --zip-output /tmp/workspace/${PACKAGE_NAME}.zip apps
