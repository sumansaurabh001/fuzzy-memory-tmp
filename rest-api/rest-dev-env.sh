#!/usr/bin/env bash



## Stripe webhooks
export STRIPE_FULFILLMENT_ENDPOINT_SECRET="whsec_As3dvh0E2TjpLfZJII5PjwPcbljrZeW5"

export STRIPE_CANCEL_SUBSCRIPTION_ENDPOINT_SECRET="whsec_5xIRAgKXV40wPzNx4vfJu2nA21NYZBUV"

## platform live keys
export STRIPE_LIVE_PUBLIC_KEY="pk_live_K6snbZIP2gEL5tDYStuqzEqR"

export STRIPE_LIVE_SECRET_KEY="sk_live_GDFsdcuts733nt4pp84S73VX"

## platform test keys
export STRIPE_TEST_PUBLIC_KEY="pk_test_WSBTkv7IREB6kOesKAnoUq1Q"

export STRIPE_TEST_SECRET_KEY="sk_test_v08Em0hvszSrnn3s7SouTMAL"

## Platform settings
export MULTI_TENANT_MODE="on";

export const APPLICATION_FEE_PERCENT="1"

## Mailgun
export MAILGUN_API_KEY="key-6972d219a458f74f74fce322f259bea0"

export MAILGUN_API_DOMAIN="mg.onlinecoursehost.com"


## needed for validating JWTs via authentication middleware
export GOOGLE_CLOUD_PROJECT=onlinecoursehost-local-dev

# needed to create custom JWTs
export GOOGLE_APPLICATION_CREDENTIALS=/Users/vasco/vasco/code/fuzzy-memory-tmp/rest-api/service-accounts/onlinecoursehost-local-dev-51579d6b8d0b.json


