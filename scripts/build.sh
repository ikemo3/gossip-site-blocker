#!/bin/bash -eu

cd $(dirname $0)/..
REPOSITORY_TOP=$(pwd)

rm -rf dist
cp -r apps dist
webpack
