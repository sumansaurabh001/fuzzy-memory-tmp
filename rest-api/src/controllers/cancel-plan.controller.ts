import {Controller, Post, Req, Res} from '@nestjs/common';
import {FirestoreService} from '../services/firestore.service';
import {getStripeSecretKey, readMandatoryEnvVar} from '../utils/utils';
import {Timestamp} from "@google-cloud/firestore";
import {sendEmail} from '../utils/send-email';

const MULTI_TENANT_MODE = readMandatoryEnvVar("MULTI_TENANT_MODE");

@Controller()
export class CancelPlanController {

  constructor(private readonly firestore: FirestoreService) {

  }

  @Post('/api/cancel-plan')
  async apiStripeCancelPlan(@Req() req, @Res() res): Promise<any> {

    try {

      const userId = req.user.uid,
        tenantId = req.body.tenantId,
        customerEmail = req.body.user.email,
        customerName = req.body.user.displayName,
        reason = req.body.reason,
        testMode = req.body.testMode || true; // TODO support users in test mode

      const tenantSettingsPath = `tenantSettings/${tenantId}`,
        tenantSettings = await this.firestore.getDocData(tenantSettingsPath),
        tenantPath = `tenants/${tenantId}`,
        tenant =  await this.firestore.getDocData(tenantPath),
        userPrivatePath = `schools/${tenantId}/usersPrivate/${userId}`,
        userPrivate = await this.firestore.getDocData(userPrivatePath);

      if (!userPrivate) {
        throw "Could not find user private data in path: " + userPrivatePath;
      }

      const tenantConfig = MULTI_TENANT_MODE ? {stripe_account: tenantSettings.stripeTenantUserId} : {};

      console.log("cancelling plan of user:", JSON.stringify(userPrivate));

      const stripe = require('stripe')(getStripeSecretKey(testMode));

      // cancel the Stripe pricing plan
      const result = await stripe.subscriptions.update(
        userPrivate.stripeSubscriptionId,
        {
          cancel_at_period_end: true
        },
        tenantConfig);

      console.log("Cancelled Stripe subscription: " + result.id);

      const planEndsAt = result.current_period_end * 1000;

      // save cancellation date in database
      const changes = {
        planEndsAt: Timestamp.fromMillis(planEndsAt)
      };

      await this.firestore.db.doc(userPrivatePath).update(changes);

      console.log("Sending cancelation reason email to tenant mailbox: " + tenant.email);

      // send email (with the cancellation reason) to the monitoring mailbox
      await sendEmail({
        from: 'noreply@onlinecoursehost.com',
        to: tenant.email,
        subject: 'Customer cancellation reason',
        text: `Customer ${customerEmail} (${customerName}) cancelled with reason:\n\n${reason}`
      });

      res.status(200).json({planEndsAt});

    }
    catch (error) {
      console.log('Unexpected error occurred while cancelling subscription: ', error);
      res.status(500).json({error});
    }


  }

}
