import {Controller, Post, Req, Res} from '@nestjs/common';
import {FirestoreService} from '../services/firestore.service';
import {convertSnapsToData, getStripePublicKey, getStripeSecretKey, isFutureTimestamp, readMandatoryEnvVar} from '../utils/utils';
const uuidv4 = require('uuid/v4');
const MULTI_TENANT_MODE = readMandatoryEnvVar("MULTI_TENANT_MODE");
const APPLICATION_FEE_PERCENT = readMandatoryEnvVar("APPLICATION_FEE_PERCENT");



@Controller()
export class PurchaseCourseController {

  constructor(private readonly firestore: FirestoreService) {

  }


  @Post('/api/purchase-course')
  async apiPurchaseCourse(@Req() request, @Res() response): Promise<any> {

    try {

      const courseId = request.body.courseId,
        userId = request.user.uid,
        tenantId = request.body.tenantId,
        courseUrl = request.body.courseUrl,
        couponCode = request.body.couponCode,
        testMode = request.body.testMode || true; // TODO support users in test mode

      // get the course from the database
      const course = await this.firestore.getDocData(`schools/${tenantId}/courses/${courseId}`);

      // get the tenant from the database
      const tenant = await this.firestore.getDocData(`tenantSettings/${tenantId}`);

      const priceAmount = course.price * 100;

      const tenantConfig = MULTI_TENANT_MODE ? {stripe_account: tenant.stripeTenantUserId} : {};

      const ongoingPurchaseSessionId = uuidv4();

      const couponPaths = `schools/${tenantId}/courses/${courseId}/coupons`;

      let coupon = null;

      if (couponCode) {
        const snaps = await this.firestore.db.collection(couponPaths).where('code', '==', couponCode).get();
        const results = convertSnapsToData(snaps);
        coupon = results.length == 1 ? results[0] : null;
      }

      const amount = this.determineChargePrice(course, coupon);

      const clientReferenceId = ongoingPurchaseSessionId + "|" + tenantId;

      const sessionConfig = {
        success_url: `${courseUrl}?purchaseResult=success&ongoingPurchaseSessionId=${ongoingPurchaseSessionId}&courseId=${courseId}`,
        cancel_url: `${courseUrl}?purchaseResult=failed`,
        payment_method_types: ['card'],
        client_reference_id: clientReferenceId,
        line_items: [{
          currency: 'usd',
          amount: amount * 100,
          quantity:1,
          name: course.title
        }],

        payment_intent_data: {
          application_fee_amount: APPLICATION_FEE_PERCENT / 100 * priceAmount
        }
      };

      const stripe = require('stripe')(getStripeSecretKey(testMode));

      // create a checkout session to purchase the course
      const session = await stripe.checkout.sessions.create(sessionConfig, tenantConfig);

      // save the ongoing purchase session
      const purchaseSessionsPath = `schools/${tenantId}/purchaseSessions/${ongoingPurchaseSessionId}`;

      await this.firestore.db.doc(purchaseSessionsPath).set({
        courseId,
        userId,
        status: 'ongoing',
        couponId: this.isCouponValid(coupon) ? coupon.id : null
      });

      const stripeSession = {
        sessionId:session.id,
        stripePublicKey: getStripePublicKey(testMode),
        stripeTenantUserId:tenant.stripeTenantUserId,
        ongoingPurchaseSessionId
      };

      response.status(200).json(stripeSession);

    }
    catch (error) {
      console.log('Unexpected error occurred while purchasing course: ', error);
      response.status(500).json({error});
    }



  }

  determineChargePrice(course, coupon) {

    if (!coupon) {
      return course.price;
    }

    if (this.isCouponValid(coupon)) {
      return coupon.price;
    }
    else {
      return course.price;
    }
  }

   isCouponValid(coupon) {
    if (!coupon) {
      return false;
    }

    return coupon.active && coupon.remaining > 0 && ( !coupon.deadline || isFutureTimestamp(coupon.deadline));
  }

}
