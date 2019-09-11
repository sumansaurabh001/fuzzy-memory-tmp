import * as functions from 'firebase-functions';
import {db} from './init';
import {apiError} from './api-utils';
import {authenticationMiddleware} from './api-authentication.middleware';
import {getDocData} from './utils';
import {keepEndpointAliveMiddleware} from './keep-endpoint-alive-middleware';

const request = require('request-promise');
const express = require('express');

const cors = require('cors');

const app = express();

// Automatically allow cross-origin requests
app.use(cors({origin: true}));

app.use(keepEndpointAliveMiddleware);

app.use(authenticationMiddleware);

const stripeSecretKey = functions.config().stripe.secret_key;

const multi_tenant_mode = functions.config().platform.multi_tenant_mode;

const stripe = require('stripe')(stripeSecretKey);


app.post('/init-pricing-plans', async (req, res) => {


});


