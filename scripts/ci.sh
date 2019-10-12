#!/bin/bash -eu

yarn install
yarn run tsc
yarn test
