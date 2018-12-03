import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {TenantService} from './tenant.service';
import {first, map} from 'rxjs/operators';
import {readCollectionWithIds} from '../common/firestore-utils';
import {CourseCoupon} from '../models/coupon.model';
import {Observable, from} from 'rxjs';
import {DocumentReference} from '../../../node_modules/@angular/fire/firestore/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CourseCouponsDbService {


  constructor(private afs: AngularFirestore,
              private tenant: TenantService) {

  }


  loadCoupons(courseId: string, activeCouponsOnly: boolean) {
    return readCollectionWithIds<CourseCoupon[]>(
      this.afs.collection(
        this.courseCouponsPath(courseId),
        ref => {

          let query = ref.orderBy('created', 'desc');

          if (activeCouponsOnly) {
            query = query.where('active', '==', true);
          }

          return query;
        })
    )
      .pipe(
        map(coupons => coupons.map(coupon => {return {...coupon, courseId}}))
      );
  }

  private courseCouponsPath(courseId: string) {
    return this.tenant.path(`courses/${courseId}/coupons`);
  }


  createNewCoupon(courseId: string, coupon: CourseCoupon) {

    const addCouponAsync = this.afs.collection(this.courseCouponsPath(courseId)).add(coupon);

    return from(addCouponAsync)
      .pipe(
        map(ref => {
            return {
              id: ref.id,
              ...coupon
            };
          })
      );

  }

}
