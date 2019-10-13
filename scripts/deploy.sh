#!/bin/bash -e

cd $(dirname $0)/..
REPOSITORY_TOP=$(pwd)

MANIFEST_VERSION=$(jq -r .version apps/manifest.json)
echo "MANIFEST_VERSION: ${MANIFEST_VERSION}"

if [ "${CI}" = "true" ]; then
  DO=
else
  DO=echo
fi

cd /tmp/workspace
${DO} go get -u github.com/tcnksm/ghr

ghr -t ${GITHUB_TOKEN} \
    -u ${CIRCLE_PROJECT_USERNAME} \
    -r ${CIRCLE_PROJECT_REPONAME} \
    -c ${CIRCLE_SHA1} \
    --replace \
    v${MANIFEST_VERSION} \
    /tmp/workspace/gossip-site-blocker.crx
