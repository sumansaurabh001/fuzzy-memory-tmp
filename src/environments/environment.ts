// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.


export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyChn9fBg7VglQr5Vui_ocb-S81S5gnqJHA',
    authDomain: 'onlinecoursehost-local-dev.firebaseapp.com',
    databaseURL: 'https://onlinecoursehost-local-dev.firebaseio.com',
    projectId: 'onlinecoursehost-local-dev',
    storageBucket: 'onlinecoursehost-local-dev.appspot.com',
    messagingSenderId: '407544233574'
  },
  authenticationUrl: 'http://login.onlinecoursehost.test:4201/login',
  stripe: {
    stripeHostClientId: 'ca_E8O23Zg2xUn1A216OEkwL0OJrW7K7wqN', // this is the Stripe ID of the platform host account, which is providing the hosting service to other tenant Stripe accounts
    stripePublicKey: 'pk_test_5NQiVpv8GxwDJxKGilXmBK15' // This is the public key used needed by Checkout.js
  },
  // Cloud Function API endpoints
  api: {
    stripeConnectionUrl: 'https://us-central1-onlinecoursehost-local-dev.cloudfunctions.net/apiStripeConnection/stripe-connection', // get the user credentials from Stripe and stores them in the DB
    customJwtUrl: 'https://us-central1-onlinecoursehost-local-dev.cloudfunctions.net/apiCreateCustomJwt/custom-jwt', // creates a custom authentication JWT for a given user. Used in the single-sign on solution for tenant domains
    purchaseCourseUrl: 'https://us-central1-onlinecoursehost-local-dev.cloudfunctions.net/apiPurchaseCourse/purchase-course',
    videoAccessUrl: 'https://us-central1-onlinecoursehost-local-dev.cloudfunctions.net/apiVideoAccess/video-access', // load the video file names only for which the user has access, which allows the user to play the video
    sendEmailUrl: 'https://us-central1-onlinecoursehost-local-dev.cloudfunctions.net/apiSendEmail/send-email',
    stripeInitPricingPlansUrl: 'https://us-central1-onlinecoursehost-local-dev.cloudfunctions.net/apiStripeInitPricingPlans/init-pricing-plans',
    stripeUpdatePricingPLanUrl: 'https://us-central1-onlinecoursehost-local-dev.cloudfunctions.net/apiStripeUpdatePricingPlan/update-pricing-plan',
    stripeActivatePlanUrl: 'https://us-central1-onlinecoursehost-local-dev.cloudfunctions.net/apiStripeActivatePlan/activate-plan',
    stripeCancelPlanUrl: 'https://us-central1-onlinecoursehost-local-dev.cloudfunctions.net/apiStripeCancelPlan/cancel-plan',
    stripeCreateSessionUrl: 'https://us-central1-onlinecoursehost-local-dev.cloudfunctions.net/apiStripeCreateSession/create-stripe-session',
    stripeFulfillmentWebhookUrl: 'https://us-central1-onlinecoursehost-local-dev.cloudfunctions.net/apiStripeFulfillmentWebhook/stripe-fulfillment-webhook' // Note: this is here just for documentation purposes, this webhook is not meant to be called by the frontend
  }
};
