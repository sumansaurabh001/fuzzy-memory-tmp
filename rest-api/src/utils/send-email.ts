import {readMandatoryEnvVar} from './utils';


const MAILGUN_API_KEY = readMandatoryEnvVar("MAILGUN_API_KEY");

const MAILGUN_API_DOMAIN = readMandatoryEnvVar("MAILGUN_API_DOMAIN");

const mailgun = require('mailgun-js')({apiKey: MAILGUN_API_KEY, domain: MAILGUN_API_DOMAIN});


export interface Email {
  from:string;
  to:string;
  subject:string;
  text?:string;
  html?:string;
}


export async function sendEmail(email:Email) {
  try {
    await mailgun.messages().send(email);
  }
  catch(err) {
    console.log("Error sending email:", email);
    console.log("Mailgun error:", err);
  }
}
