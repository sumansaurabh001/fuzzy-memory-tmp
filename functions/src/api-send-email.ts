import * as functions from 'firebase-functions';
import {authenticationMiddleware} from './api-authentication.middleware';
import {getDocData} from './utils';
import {Email, sendEmail} from './send-email';
import {keepEndpointAliveMiddleware} from './keep-endpoint-alive-middleware';

const express = require('express');
const cors = require('cors');

const app = express();

// Automatically allow cross-origin requests
app.use(cors({origin: true}));

app.use(keepEndpointAliveMiddleware);

app.use(authenticationMiddleware);


app.post('/send-email', async (req, res) => {

  try {

    const userId = req.user.uid,
      tenantId = req.body.tenantId,
      email = req.body.email;

    const tenantPath = `tenants/${tenantId}`,
      tenant = await getDocData(tenantPath);

    const emailMessage: Email = {
    ...email,
      to: tenant.supportEmail
    };

    console.log("Sending email: ", JSON.stringify(emailMessage));

    // send email with customer message to the tenant support mailbox
    await sendEmail(emailMessage);

    res.status(200).json({message: 'Email sent successfully.'});

  }
  catch (error) {
    console.log('Unexpected error occurred while sending contact email: ', error);
    res.status(500).json({error});
  }

});


export const apiSendEmail = functions.https.onRequest(app);



