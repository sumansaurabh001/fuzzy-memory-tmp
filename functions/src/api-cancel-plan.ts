import * as functions from 'firebase-functions';
import {authenticationMiddleware} from './api-authentication.middleware';
import {auth, db} from './init';
import {getDocData} from './utils';
import {sendEmail} from './send-email';
import {keepEndpointAliveMiddleware} from './keep-endpoint-alive-middleware';

const express = require('express');
const cors = require('cors');

const firebase = require('firebase-admin');

const stripeSecretKey = functions.config().stripe.secret_key;

const multi_tenant_mode = functions.config().platform.multi_tenant_mode;

const stripe = require('stripe')(stripeSecretKey);

const app = express();

// Automatically allow cross-origin requests
app.use(cors({origin: true}));

app.use(keepEndpointAliveMiddleware);

app.use(authenticationMiddleware);


app.post('/cancel-plan', async (req, res) => {


});




