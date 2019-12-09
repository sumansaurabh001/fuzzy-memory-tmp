import {Controller, Post, Req, Res} from '@nestjs/common';
import {FirestoreService} from '../services/firestore.service';
import {getStripePublicKey, getStripeSecretKey, readMandatoryEnvVar} from '../utils/utils';
const uuidv4 = require('uuid/v4');

const MULTI_TENANT_MODE = readMandatoryEnvVar("MULTI_TENANT_MODE");
const APPLICATION_FEE_PERCENT = readMandatoryEnvVar("APPLICATION_FEE_PERCENT");

interface ReqInfo {
  plan: any;
  quantity:number;
  userId: string;
  tenantId: string;
  oneTimeCharge: boolean;
  subscriptionUrl: string;
  tenant?: any;
  user?: any;
  testUser?:boolean;
}


@Controller()
export class ActivatePlanController {

  constructor(private readonly firestore: FirestoreService) {

  }

  @Post('/api/activate-plan')
  async apiActivatePlan(@Req() request, @Res() response): Promise<any> {

    try {

      const reqInfo: ReqInfo = {
        plan: request.body.plan,
        quantity: request.body.quantity,
        userId: request.user.uid,
        tenantId: request.body.tenantId,
        oneTimeCharge: request.body.oneTimeCharge,
        subscriptionUrl: request.body.subscriptionUrl,
        testUser: request.body.testUser
      };

      // get the tenant from the database
      const tenantPath = `tenantSettings/${reqInfo.tenantId}`,
        tenant = await this.firestore.getDocData(tenantPath);

      // get the user from the database
      const userPath = `schools/${reqInfo.tenantId}/users/${reqInfo.userId}`,
        usersPrivatePath = `schools/${reqInfo.tenantId}/usersPrivate/${reqInfo.userId}`,
        user = await this.firestore.getDocData(userPath),
        userPrivate = await this.firestore.getDocData(usersPrivatePath);

      reqInfo.tenant = tenant;
      reqInfo.user = user;

      const tenantConfig = MULTI_TENANT_MODE ? {stripe_account: reqInfo.tenant.stripeTenantUserId} : {};

      const ongoingPurchaseSessionId = uuidv4();

      let sessionConfig:any = {
        success_url: `${reqInfo.subscriptionUrl}?purchaseResult=success&ongoingPurchaseSessionId=${ongoingPurchaseSessionId}`,
        cancel_url: `${reqInfo.subscriptionUrl}?purchaseResult=failed`,
        payment_method_types: ['card'],
        client_reference_id: ongoingPurchaseSessionId + "|" + reqInfo.tenantId
      };

      if (reqInfo.oneTimeCharge) {

        // passing customer with subscription data is not yet supported
        if (userPrivate.stripeCustomerId) {
          sessionConfig.customer = userPrivate.stripeCustomerId;
        }

        sessionConfig = {
          ...sessionConfig,
          line_items: [{
            currency: 'usd',
            amount: reqInfo.plan.price,
            name: reqInfo.plan.description
          }],
          payment_intent_data: {
            application_fee_amount: APPLICATION_FEE_PERCENT  * reqInfo.plan.price
          }
        }
      } else {
        sessionConfig = {
          ...sessionConfig,
          subscription_data: {
            items: [{
              plan: reqInfo.plan.stripePlanId,
              quantity:reqInfo.quantity
            }],
            application_fee_percent: APPLICATION_FEE_PERCENT,
          }
        }
      }

      const stripe = require('stripe')(getStripeSecretKey(reqInfo.testUser));

      // create a checkout session
      const session = await stripe.checkout.sessions.create(sessionConfig, tenantConfig);

      console.log("Created plan activation session: ", JSON.stringify(session));

      // save the ongoing purchase session
      const purchaseSessionsPath = `schools/${reqInfo.tenantId}/purchaseSessions/${ongoingPurchaseSessionId}`;

      await this.firestore.db.doc(purchaseSessionsPath).set({
        plan: reqInfo.plan.frequency,
        userId: reqInfo.userId,
        status: 'ongoing'
      });

      const stripeSession = {
        sessionId:session.id,
        stripePublicKey: getStripePublicKey(reqInfo.testUser),
        stripeTenantUserId:reqInfo.tenant.stripeTenantUserId,
        ongoingPurchaseSessionId
      };

      response.status(200).json(stripeSession);

    } catch (error) {
      console.log('Unexpected error occurred while creating subscription: ', error);
      response.status(500).json({error});
    }

  }

}
