#!/bin/sh

firebase functions:config:set stripe.secret_key="sk_test_v08Em0hvszSrnn3s7SouTMAL" stripe.public_key="pk_test_WSBTkv7IREB6kOesKAnoUq1Q"  stripe.application_fee_percent="1"  stripe.webhook_secret="whsec_jLrC1wc3AFzIB7TWQsCvTksECrEy8vxa" platform.multi_tenant_mode="on"  platform.mailgun_api_key="key-6972d219a458f74f74fce322f259bea0"

# restart functions only, in order to apply the new environment variables
firebase deploy --only functions
