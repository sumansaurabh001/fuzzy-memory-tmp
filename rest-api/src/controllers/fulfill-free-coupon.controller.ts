import {Body, Controller, Post, Req} from '@nestjs/common';
import {FirestoreService} from '../services/firestore.service';
import {isFutureTimestamp} from '../utils/utils';
import {FieldValue} from '@google-cloud/firestore';

@Controller()
export class FulfillFreeCouponController {

  constructor(private readonly firestore: FirestoreService) {

  }

  @Post("/api/fulfill-free-coupon")
  async fulfillFreeCourseCoupon(
    @Body("courseId") courseId:string,
    @Body("couponCode") couponCode:string,
    @Body("tenantId") tenantId:string,
    @Req() request) {

    const userId = request.user.uid;

    const courseSnaps = await this.firestore.db
      .collection(`schools/${tenantId}/courses/${courseId}/coupons`)
      .where("code", "==", couponCode)
      .get();

    console.log(courseSnaps);

    if (courseSnaps.docs.length == 0) {
      throw `Could not find coupon wit code ${couponCode}`;
    }

    if (courseSnaps.docs.length > 1) {
      throw `Found several coupons with code ${couponCode}, this should not be possible.`;
    }

    const coupon = courseSnaps.docs[0].data(),
          couponId = courseSnaps.docs[0].id;

    if (!coupon.free) {
      throw `Coupon ${couponCode} is not a free coupon.`;
    }

    if (coupon.remaining <= 0) {
      throw `All coupons with code ${couponCode} have been redeemed, please contact us to get a valid coupon.`;
    }

    if (!isFutureTimestamp(coupon.deadline)) {
      throw `The coupon code ${couponCode} is meanwhile expired, please contact us to get a new coupon.`;
    }

    const batch = this.firestore.db.batch();

    const couponRef = this.firestore.db.doc(`schools/${tenantId}/courses/${courseId}/coupons/${couponId}`);

    batch.update(couponRef, {
      "remaining": FieldValue.increment(-1)
    });

    const usersPrivatePath = `schools/${tenantId}/usersPrivate/${userId}`;

    let userPrivate = await this.firestore.getDocData(usersPrivatePath);

    let purchasedCourses = userPrivate && userPrivate.purchasedCourses ? userPrivate.purchasedCourses : [];

    purchasedCourses.push(courseId);

    const userPrivateRef = this.firestore.db.doc(usersPrivatePath);

    batch.set(userPrivateRef, {
        purchasedCourses
      },
      {merge: true});

    return batch.commit();

  }


}
