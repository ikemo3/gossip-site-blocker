#!/bin/bash -eu

yarn install
yarn run tsc
yarn lint
yarn test

yarn archive
yarn integration-test
