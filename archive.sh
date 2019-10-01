#!/bin/sh

cd apps
npx tsc
zip ../gossip-site-blocker.zip -r *
