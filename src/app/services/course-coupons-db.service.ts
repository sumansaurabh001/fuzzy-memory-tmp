import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {TenantService} from './tenant.service';
import {first, map} from 'rxjs/operators';
import {readCollectionWithIds} from '../common/firestore-utils';
import {CourseCoupon} from '../models/coupon.model';
import {Observable, from} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseCouponsDbService {


  constructor(private afs: AngularFirestore,
              private tenant: TenantService) {

  }


  loadActiveCoupons(courseId:string) {
    return readCollectionWithIds<CourseCoupon[]>(
      this.afs.collection(
        this.courseCouponsPath(courseId),
        ref => ref.where("status", "==", true).orderBy('created', 'desc'))
    );
  }

  private courseCouponsPath(courseId:string) {
    return this.tenant.path(`courses/${courseId}/coupons`);
  }


  createNewCoupon(courseId: string, coupon: CourseCoupon) {

      const addCouponAsync = this.afs.collection(this.courseCouponsPath(courseId)).add(coupon);

      return from(addCouponAsync);

  }

}
