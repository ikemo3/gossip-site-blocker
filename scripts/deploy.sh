#!/bin/bash -e

cd $(dirname $0)/..
REPOSITORY_TOP=$(pwd)

PACKAGE_NAME=$(jq -r .name package.json)
echo "PACKAGE_NAME: ${PACKAGE_NAME}"

MANIFEST_VERSION=$(jq -r .version apps/manifest.json)
echo "MANIFEST_VERSION: ${MANIFEST_VERSION}"

SHA=$(git rev-parse HEAD)
echo "SHA: ${SHA}"

if [ "${CI}" = "true" ]; then
  DO=
else
  DO=echo
fi

cd /tmp/workspace
if [ "${CIRCLE_BRANCH}" != "" ]; then
  OPTIONS="-prerelease -recreate"
  TAG=snapshot
  NAME="snapshot"

  # rename assets
  mv ${PACKAGE_NAME}.crx ${PACKAGE_NAME}-snapshot.crx
  mv ${PACKAGE_NAME}.zip ${PACKAGE_NAME}-snapshot.zip
elif [ "${CIRCLE_TAG}" != "" ]; then
  if [ "${CIRCLE_TAG}" = "snapshot" ]; then
    echo 'ignore `snapshot` tag (already released)'
    exit 0
  fi

  OPTIONS="-recreate"
  TAG=${CIRCLE_TAG}
  NAME=""

  # rename assets
  mv ${PACKAGE_NAME}.crx ${PACKAGE_NAME}-${MANIFEST_VERSION}.crx
  mv ${PACKAGE_NAME}.zip ${PACKAGE_NAME}-${MANIFEST_VERSION}.zip
else
  cd ${REPOSITORY_TOP}
  OPTIONS="-recreate"
  TAG=$(git symbolic-ref --short HEAD)
  NAME="snapshot"
fi

${DO} go get -u github.com/tcnksm/ghr

cd ${REPOSITORY_TOP}
${DO} ghr -c ${SHA} -n ${NAME} ${OPTIONS} ${TAG} /tmp/workspace/
