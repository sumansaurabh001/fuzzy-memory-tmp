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


app.post('/update-pricing-plan', async (req, res) => {

  try {

    const tenantId = req.user.uid,
      planName = req.body.planName,
      newPlanDescription = req.body.changes.description,
      newPlanPrice = Math.round(req.body.changes.price),
      newPlanFrequency = req.body.changes.frequency;

    console.log("Updating pricing plan:", JSON.stringify(req.body));

    // get the tenant from the database
    const tenantSettings = await getDocData(`tenantSettings/${tenantId}`);

    console.log("tenant", JSON.stringify(tenantSettings));

    const tenantConfig = multi_tenant_mode ? {stripe_account: tenantSettings.stripeTenantUserId} : {};

    const newPlanResponse = await stripe.plans.create({
        amount: newPlanPrice,
        interval: newPlanFrequency,
        product: {
          name: newPlanDescription
        },
        currency: 'usd',
      },
      tenantConfig);

    const tenantPath = `tenants/${tenantId}`;

    const tenant = await getDocData(tenantPath);

    const pricingPlans = tenant.pricingPlans;

    const changes = {
      stripePlanId: newPlanResponse.id
    };

    pricingPlans[planName] = {
      ...pricingPlans[planName],
      ...changes
    };

    await db.doc(tenantPath).update({pricingPlans});

    res.status(200).json(changes);

  }
  catch (error) {
    console.log('Unexpected error initializing pricing plans: ', error);
    res.status(500).json({error});
  }


});


export const apiStripeUpdatePricingPlan = functions.https.onRequest(app);
