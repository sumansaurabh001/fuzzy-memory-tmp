import * as functions from 'firebase-functions';


const mailgun_api_key = functions.config().platform.mailgun_api_key;

const mailgun = require('mailgun-js')({apiKey: mailgun_api_key, domain: 'mg.onlinecoursehost.com'});


export interface Email {
  from:string;
  to:string;
  subject:string;
  text:string;
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
