import {Controller, Post, Req, Res} from '@nestjs/common';
import {FirestoreService} from '../services/firestore.service';
import {getStripePublicKey, getStripeSecretKey, readMandatoryEnvVar} from '../utils/utils';

const uuidv4 = require('uuid/v4');

const MULTI_TENANT_MODE = readMandatoryEnvVar("MULTI_TENANT_MODE");


@Controller()
export class UpdateCardController {

  constructor(private readonly firestore: FirestoreService) {

  }

  @Post('/api/update-card')
  async apiUpdateCard(@Req() request, @Res() response): Promise<any> {

    const userSettingsUrl = request.body.userSettingsUrl,
      tenantId = request.body.tenantId,
      userId = request.user.uid,
      stripeCustomerId = request.body.stripeCustomerId,
      testMode = request.body.testMode || true; // TODO support users in test mode

    const ongoingPurchaseSessionId = uuidv4();

    const clientReferenceId = ongoingPurchaseSessionId + "|" + tenantId;

    const sessionConfig = {
      success_url: `${userSettingsUrl}?cardUpdateResult=success&ongoingPurchaseSessionId=${ongoingPurchaseSessionId}`,
      cancel_url: `${userSettingsUrl}?cardUpdateResult=failed`,
      mode: 'setup',
      payment_method_types: ['card'],
      client_reference_id: clientReferenceId
    };

    const stripe = require('stripe')(getStripeSecretKey(testMode));

    const tenant = await this.firestore.getDocData(`tenantSettings/${tenantId}`);

    const tenantConfig = MULTI_TENANT_MODE ? {stripe_account: tenant.stripeTenantUserId} : {};

    // create a checkout session to purchase the course
    const session = await stripe.checkout.sessions.create(sessionConfig, tenantConfig);

    // save the ongoing session
    const checkoutSession = `schools/${tenantId}/purchaseSessions/${ongoingPurchaseSessionId}`;

    await this.firestore.db.doc(checkoutSession).set({
      status: 'ongoing',
      userId,
      type: 'cardUpdate',
      stripeCustomerId
    });

    const stripeSession = {
      sessionId:session.id,
      stripePublicKey: getStripePublicKey(testMode),
      stripeTenantUserId:tenant.stripeTenantUserId,
      ongoingPurchaseSessionId
    };

    response.status(200).json(stripeSession);

  }

}
