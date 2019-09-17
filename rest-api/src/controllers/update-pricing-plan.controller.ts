import {Controller, Get, Post, Req, Res} from '@nestjs/common';
import {FirestoreService} from '../services/firestore.service';
import {getStripeSecretKey, readMandatoryEnvVar} from '../utils/utils';
const request = require('request-promise');

const MULTI_TENANT_MODE = readMandatoryEnvVar("MULTI_TENANT_MODE");


@Controller()
export class UpdatePricingPlanController {

  constructor(private readonly firestore: FirestoreService) {

  }

  @Post('/api/update-pricing-plan')
  async apiStripeUpdatePricingPlan(@Req() req, @Res() res): Promise<any> {

    try {

      const tenantId = req.user.uid,
        planName = req.body.planName,
        newPlanDescription = req.body.changes.description,
        newPlanPrice = Math.round(req.body.changes.price),
        newPlanFrequency = req.body.changes.frequency,
        testUser = req.body.testUser;

      console.log("Updating pricing plan:", JSON.stringify(req.body));

      // get the tenant from the database
      const tenantSettings = await this.firestore.getDocData(`tenantSettings/${tenantId}`);

      console.log("tenant", JSON.stringify(tenantSettings));

      const tenantConfig = MULTI_TENANT_MODE ? {stripe_account: tenantSettings.stripeTenantUserId} : {};

      const stripe = require('stripe')(getStripeSecretKey(testUser));

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

      const tenant = await this.firestore.getDocData(tenantPath);

      const pricingPlans = tenant.pricingPlans;

      const changes = {
        stripePlanId: newPlanResponse.id
      };

      pricingPlans[planName] = {
        ...pricingPlans[planName],
        ...changes
      };

      await this.firestore.db.doc(tenantPath).update({pricingPlans});

      res.status(200).json(changes);

    }
    catch (error) {
      console.log('Unexpected error updating pricing plan: ', error);
      res.status(500).json({error});
    }

  }

}
