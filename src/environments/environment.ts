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
  stripe: {
    stripeHostClientId: 'ca_Cy5anMny12mdtLh35j2Dbci2SetKr4j2'
  }
};
