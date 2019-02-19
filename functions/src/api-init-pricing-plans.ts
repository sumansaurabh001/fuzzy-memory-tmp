import * as functions from 'firebase-functions';
import {db} from './init';
import {apiError} from './api-utils';
import {authenticationMiddleware} from './api-authentication.middleware';
import {getDocData} from './utils';

const request = require('request-promise');
const express = require('express');

const cors = require('cors');

const app = express();

// Automatically allow cross-origin requests
app.use(cors({origin: true}));

app.use(authenticationMiddleware);

const stripeSecretKey = functions.config().stripe.secret_key;

const stripe = require('stripe')(stripeSecretKey);


app.post('/init-pricing-plans', async (req, res) => {

  try {

    const tenantId = req.user.uid,
      monthlyPlanDescription = req.body.monthlyPlanDescription,
      yearlyPlanDescription = req.body.yearlyPlanDescription,
      monthlyPlanPrice = req.body.monthlyPlanPrice,
      yearlyPlanPrice = req.body.yearlyPlanPrice,
      lifetimeAccessPrice = req.body.lifetimeAccessPrice;

    // get the tenant from the database
    const tenant = await getDocData(`tenantSettings/${tenantId}`);

    const monthlyResponse = await stripe.plans.create({
        amount: monthlyPlanPrice,
        interval: 'month',
        product: {
          name: monthlyPlanDescription
        },
        currency: 'usd',
      },
      {
        stripe_account: tenant.stripeTenantUserId
      });

    console.log('Created monthly plan:', monthlyResponse);

    const yearlyResponse = await stripe.plans.create({
        amount: yearlyPlanPrice,
        interval: 'year',
        product: {
          name: yearlyPlanDescription
        },
        currency: 'usd',
      },
      {
        stripe_account: tenant.stripeTenantUserId
      });

    console.log('Created yearly plan:', yearlyResponse);

    const pricingPlans = {
      monthlyPlan: {
        stripePlanId: monthlyResponse.id,
        description: monthlyPlanDescription,
        price: monthlyPlanPrice,
        frequency: 'month',
        features: [
          'Access All Courses',
          'Access all Future Videos'
        ]
      },
      yearlyPlan: {
        stripePlanId: yearlyResponse.id,
        description: yearlyPlanDescription,
        price: yearlyPlanPrice,
        frequency: 'year',
        features: [
          'Best Value',
          'Ideal for Training Request',
          'Access All Courses',
          'Access all Future Videos'
        ]
      },
      lifetimePlan: {
        description: 'Lifetime Plan',
        price: lifetimeAccessPrice,
        frequency: 'lifetime',
        features: [
          'Lifetime Access To All Content!',
          'Access All Courses',
          'Access all Future Videos',
          'Instructor Support'
        ]
      }
    };

    const tenantPath = `tenants/${tenantId}`;

    console.log('Saving plans in DB:', pricingPlans);

    await db.doc(tenantPath).update({pricingPlans});

    res.status(200).json(pricingPlans);

  }
  catch (error) {
    console.log('Unexpected error initializing pricing plans: ', error);
    res.status(500).json({error});
  }

});


export const apiStripeInitPricingPlans = functions.https.onRequest(app);
