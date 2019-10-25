#!/bin/bash -eu

PACKAGE_NAME=$(jq -r .name package.json)

### create Chrome Extension
# decode private key
mkdir -p tmp/workspace
echo ${PEM_BASE64} | openssl enc -d -base64 -A > tmp/${PACKAGE_NAME}.pem

# create Chrome Extension(signed)
echo "Create ${PACKAGE_NAME}.crx"
yarn crx pack -o tmp/workspace/${PACKAGE_NAME}.crx apps -p tmp/${PACKAGE_NAME}.pem

# create Chrome Extension(unsigned)
echo "Create ${PACKAGE_NAME}.zip"
yarn crx pack --zip-output tmp/workspace/${PACKAGE_NAME}.zip apps
