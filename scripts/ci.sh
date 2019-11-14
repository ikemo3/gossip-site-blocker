#!/bin/bash -eu

yarn install
yarn run tsc
yarn lint-for-ci
yarn test

yarn archive
yarn integration-test
