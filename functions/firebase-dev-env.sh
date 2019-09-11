#!/bin/sh

##
## currently no environment vars are needed on firebase functions, everything was moved to the REST API
##

## firebase functions:config:set platform.mailgun_api_key="key-6972d219a458f74f74fce322f259bea0"



# restart functions only, in order to apply the new environment variables
firebase deploy --only functions
