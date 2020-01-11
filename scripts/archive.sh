#!/bin/bash -e

PACKAGE_NAME=$(jq -r .name package.json)
MANIFEST_VERSION=$(jq -r .version dist/manifest.json)

# store manifest.json
git checkout -- apps/manifest.json
MANIFEST=$(cat apps/manifest.json)

### create Chrome Extension
# rewrite manifest.json
if [[ "${CIRCLE_BRANCH}" != "" ]]; then
  echo 'add `version_name` to manifest.json'
  NOW=$(date +%Y%m%d-%H%M)
  echo ${MANIFEST} | jq ". | .version_name = \"${MANIFEST_VERSION}-snapshot(${NOW})\"" \
    > dist/manifest.json
fi

# decode private key
mkdir -p tmp/workspace

if [ "${PEM_BASE64}" != "" ]; then
  echo ${PEM_BASE64} | openssl enc -d -base64 -A > tmp/${PACKAGE_NAME}.pem

  # create Chrome Extension(signed)
  echo "Create ${PACKAGE_NAME}.crx"
  yarn crx pack -o tmp/workspace/${PACKAGE_NAME}.crx dist -p tmp/${PACKAGE_NAME}.pem
else
  # create Chrome Extension(signed, create private key)
  yarn crx pack -o tmp/workspace/${PACKAGE_NAME}.crx dist
fi

# create Chrome Extension(unsigned)
echo "Create ${PACKAGE_NAME}.zip"
yarn crx pack --zip-output tmp/workspace/${PACKAGE_NAME}.zip dist

### create Firefox Extension
EXTENSION_ID=$(cat dist/.web-extension-id | tail -1)
echo "extension id: ${EXTENSION_ID}"

# rewrite manifest.json
echo ${MANIFEST} | jq ". | .browser_specific_settings = {\"gecko\": {\"id\": \"${EXTENSION_ID}\"}}" \
  > dist/manifest.json

# create *.xpi
echo "Create ${PACKAGE_NAME}.xpi"
cd dist
zip -r ../tmp/workspace/${PACKAGE_NAME}.xpi *

# restore manifest.json
cd ..
git checkout -- apps/manifest.json
