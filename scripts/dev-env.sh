#!/bin/sh

firebase functions:config:set stripe.secret_key="sk_test_v08Em0hvszSrnn3s7SouTMAL"

# restart functions only, in order to apply the new environment variables
firebase deploy --only functions
