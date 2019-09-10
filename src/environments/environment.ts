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
    stripeHostClientId: 'ca_E8O23Zg2xUn1A216OEkwL0OJrW7K7wqN', // this is the Stripe ID of the platform Connect host account, which is providing the hosting service to other tenant Stripe accounts
    stripePublicKey: 'pk_test_5NQiVpv8GxwDJxKGilXmBK15' // This is the public key needed by Checkout.js
  },
  // REST API endpoints
  api: {
    purchaseCourseUrl: 'http://localhost:5000/api/purchase-course',
    customJwtUrl: 'http://localhost:5000/api/custom-jwt', // creates a custom authentication JWT for a given user. Used in the single-sign on solution for tenant domains
    stripeActivatePlanUrl: 'http://localhost:5000/api/activate-plan',
    stripeCancelPlanUrl: 'http://localhost:5000/api/cancel-plan',
    videoAccessUrl: 'http://localhost:5000/api/video-access', // load the video file names only for which the user has access, which allows the user to play the video
    sendEmailUrl: 'http://localhost:5000/api/send-email',

    stripeConnectionUrl: 'https://us-central1-onlinecoursehost-local-dev.cloudfunctions.net/apiStripeConnection/stripe-connection', // get the user credentials from Stripe and stores them in the DB
    stripeInitPricingPlansUrl: 'https://us-central1-onlinecoursehost-local-dev.cloudfunctions.net/apiStripeInitPricingPlans/init-pricing-plans',
    stripeUpdatePricingPLanUrl: 'https://us-central1-onlinecoursehost-local-dev.cloudfunctions.net/apiStripeUpdatePricingPlan/update-pricing-plan'
  }
};
