#!/bin/bash -eu

cd $(dirname $0)/..
REPOSITORY_TOP=$(pwd)

webpack
