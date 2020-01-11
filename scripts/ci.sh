#!/bin/bash -eu

yarn install
yarn lint-for-ci
# yarn test

yarn build
yarn archive
yarn integration-test
