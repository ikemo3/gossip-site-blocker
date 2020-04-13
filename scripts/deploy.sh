#!/bin/bash -e

cd $(dirname $0)/..
REPOSITORY_TOP=$(pwd)

PACKAGE_NAME=$(jq -r .name package.json)
echo "PACKAGE_NAME: ${PACKAGE_NAME}"

PACKAGE_VERSION=$(jq -r .version package.json)
echo "PACKAGE_VERSION: ${PACKAGE_VERSION}"

MANIFEST_VERSION=$(jq -r .version apps/manifest.json)
echo "MANIFEST_VERSION: ${MANIFEST_VERSION}"

SHA=$(git rev-parse HEAD)
echo "SHA: ${SHA}"

if [[ "${CI}" = "true" ]]; then
  DO=
else
  DO=echo
fi

if [[ "${CIRCLE_BRANCH}" != "" ]]; then
  OPTIONS="-prerelease -recreate"
  TAG=snapshot
  NAME="snapshot"

  # rename assets
  cd tmp/workspace
  mv ${PACKAGE_NAME}.crx ${PACKAGE_NAME}-snapshot.crx
  mv ${PACKAGE_NAME}.zip ${PACKAGE_NAME}-snapshot.zip
  mv ${PACKAGE_NAME}.xpi ${PACKAGE_NAME}-snapshot.xpi
elif [[ "${CIRCLE_TAG}" != "" ]]; then
  if [[ "${CIRCLE_TAG}" = "snapshot" ]]; then
    echo 'ignore `snapshot` tag (already released)'
    exit 0
  fi

  if [[ "${CIRCLE_TAG}" =~ spike$ ]]; then
    echo "tag =~ spike$"
    echo "tag: ${CIRCLE_TAG}"
  else
    # verify tag == manifest version
    if [[ "${CIRCLE_TAG}" != "v${MANIFEST_VERSION}" ]]; then
      echo "tag != 'v' + manifest_version"
      echo "tag: ${CIRCLE_TAG}"
      echo "manifest: ${MANIFEST_VERSION}"
      exit 1
    fi

    echo 'verify version_name does not exist'
    ! jq -e .version_name apps/manifest.json
  fi

  OPTIONS="-recreate"
  TAG=${CIRCLE_TAG}
  NAME=${CIRCLE_TAG}

  # rename assets
  cd tmp/workspace
  mv ${PACKAGE_NAME}.crx ${PACKAGE_NAME}-${MANIFEST_VERSION}.crx
  mv ${PACKAGE_NAME}.zip ${PACKAGE_NAME}-${MANIFEST_VERSION}.zip
  mv ${PACKAGE_NAME}.xpi ${PACKAGE_NAME}-${MANIFEST_VERSION}.xpi
else
  OPTIONS="-recreate"
  TAG=$(git symbolic-ref --short HEAD)
  NAME="snapshot"
fi

${DO} go get -u github.com/tcnksm/ghr

cd ${REPOSITORY_TOP}
${DO} ghr -c ${SHA} -n ${NAME} ${OPTIONS} ${TAG} tmp/workspace/
