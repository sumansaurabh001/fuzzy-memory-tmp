import * as functions from 'firebase-functions';
import {db} from './init';
import {apiError} from './api-utils';
import {keepEndpointAliveMiddleware} from './keep-endpoint-alive-middleware';

const request = require('request-promise');
const express = require('express');

const cors = require('cors');




const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.use(keepEndpointAliveMiddleware);








app.post('/stripe-connection', async (req,res) => {



});








