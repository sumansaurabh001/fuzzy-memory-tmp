import {Controller, Post, Req, Res} from '@nestjs/common';
import {FirestoreService} from '../services/firestore.service';
import {getStripeSecretKey, readMandatoryEnvVar} from '../utils/utils';


const MULTI_TENANT_MODE = readMandatoryEnvVar("MULTI_TENANT_MODE");


@Controller()
export class InitPricingPlansController {

  constructor(private readonly firestore: FirestoreService) {

  }


  @Post("/api/init-pricing-plans")
  async apiStripeInitPricingPlans(@Req() req, @Res() res): Promise<any> {

    try {

      const tenantId = req.user.uid,
        monthlyPlanDescription = req.body.monthlyPlanDescription,
        yearlyPlanDescription = req.body.yearlyPlanDescription,
        monthlyPlanPrice = req.body.monthlyPlanPrice,
        yearlyPlanPrice = req.body.yearlyPlanPrice,
        lifetimeAccessPrice = req.body.lifetimeAccessPrice,
        testUser = req.body.testUser;

      // get the tenant from the database
      const tenant = await this.firestore.getDocData(`tenantSettings/${tenantId}`);

      const tenantConfig = MULTI_TENANT_MODE ? {stripe_account: tenant.stripeTenantUserId} : {};

      const stripe = require('stripe')(getStripeSecretKey(testUser));

      const monthlyResponse = await stripe.plans.create({
          amount: monthlyPlanPrice,
          interval: 'month',
          product: {
            name: monthlyPlanDescription
          },
          currency: 'usd',
        },
        tenantConfig);

      console.log('Created monthly plan:', monthlyResponse);

      const yearlyResponse = await stripe.plans.create({
          amount: yearlyPlanPrice,
          interval: 'year',
          product: {
            name: yearlyPlanDescription
          },
          currency: 'usd',
        },
        tenantConfig);

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
          undiscountedPrice: 12 * monthlyPlanPrice,
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

      await this.firestore.db.doc(tenantPath).update({pricingPlans});

      res.status(200).json(pricingPlans);

    }
    catch (error) {
      console.log('Unexpected error initializing pricing plans: ', error);
      res.status(500).json({error});
    }


  }

}
