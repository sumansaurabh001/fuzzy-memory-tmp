#!/bin/sh

firebase functions:config:set stripe.secret_key="sk_test_v08Em0hvszSrnn3s7SouTMAL" stripe.application_fee_percent="1" platform.multi_tenant_mode="on"

# restart functions only, in order to apply the new environment variables
firebase deploy --only functions
