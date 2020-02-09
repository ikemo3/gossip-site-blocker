#!/bin/bash

ACCESS_TOKEN=$(curl "https://accounts.google.com/o/oauth2/token" -d "client_id=${GSB_API_CLIENT_ID}&client_secret=${GSB_API_CLIENT_SECRET}&refresh_token=${GSB_OAUTH_REFRESH_TOKEN}&grant_type=refresh_token&redirect_uri=urn:ietf:wg:oauth:2.0:oob" | jq -r .access_token)
curl -H "Authorization: Bearer ${ACCESS_TOKEN}" -H "x-goog-api-version: 2" -X PUT -T tmp/workspace/gossip-site-blocker.zip -v "https://www.googleapis.com/upload/chromewebstore/v1.1/items/${GSB_APP_ID_BETA}"
curl -H "Authorization: Bearer ${ACCESS_TOKEN}" -H "x-goog-api-version: 2" -H "Content-Length: 0" -X POST -v "https://www.googleapis.com/chromewebstore/v1.1/items/${GSB_APP_ID_BETA}/publish"
