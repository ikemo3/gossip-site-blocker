#!/bin/bash -e

if [ "${CI}" = "true" ]; then
  DO=
else
  DO=echo
fi

${DO} go get -u github.com/tcnksm/ghr

ghr -t ${GITHUB_TOKEN} \
    -u ${CIRCLE_PROJECT_USERNAME} \
    -r ${CIRCLE_PROJECT_REPONAME} \
    -c ${CIRCLE_SHA1} \
    --replace \
    v$(cat /tmp/workspace/version) \
    /tmp/workspace/gossip-site-blocker.crx
