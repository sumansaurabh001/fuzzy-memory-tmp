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
  authenticationUrl: 'http://login.onlinecoursehost.test/login',
  stripe: {
    stripeHostClientId: 'ca_E8O23Zg2xUn1A216OEkwL0OJrW7K7wqN' // this is the Stripe ID of the platform host account, which is providing the hosting service to other tenant Stripe accounts
  },
  // Cloud Function API endpoints
  api: {
    stripeConnectionUrl: 'https://us-central1-onlinecoursehost-local-dev.cloudfunctions.net/apiStripeConnection' // get the user credentials from Stripe and stores them in the DB

  }
};
