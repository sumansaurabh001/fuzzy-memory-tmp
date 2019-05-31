import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {AddCoupon, AddCoupons, CouponActionTypes, LoadCoupon, LoadCouponCompleted, LoadCoupons, UpdateCoupon} from './coupons.actions';
import {catchError, concatMap, map, mergeMap, withLatestFrom} from 'rxjs/operators';
import {CourseCouponsDbService} from '../services/course-coupons-db.service';
import {select, Store} from '@ngrx/store';
import {isActiveCourseLessonsLoaded, selectActiveCourse} from './selectors';
import {AppState} from './index';
import {MessagesService} from '../services/messages.service';
import {LoadingService} from '../services/loading.service';
import {CourseCoupon} from '../models/coupon.model';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CouponEffects {

  @Effect()
  loadCoupons$ = this.actions$
    .pipe(
      ofType<LoadCoupons>(CouponActionTypes.LoadCoupons),
      withLatestFrom(this.store.pipe(select(selectActiveCourse))),
      concatMap(([action, course]) => this.loading.showLoader<CourseCoupon[]>(
        this.dbCoupons.loadCoupons(course.id, action.payload.activeCouponsOnly))),
      map(coupons => new AddCoupons({coupons})),
      catchError(err => {
        this.messages.error('Could not load course coupons.');
        return throwError(err);
      })
    );

  @Effect()
  loadCoupon = this.actions$
    .pipe(
      ofType<LoadCoupon>(CouponActionTypes.LoadCoupon),
      concatMap(action => this.loading.showLoader(this.dbCoupons.findCouponByCode(action.payload.courseId, action.payload.couponCode))),
      map(coupon => new LoadCouponCompleted({coupon}))
    );

  @Effect({dispatch: false})
  saveCoupon$ = this.actions$
    .pipe(
      ofType<UpdateCoupon>(CouponActionTypes.UpdateCoupon),
      concatMap(action => this.dbCoupons.saveCoupon(action.payload.courseId, action.payload.coupon.id, action.payload.coupon.changes))
    );

  @Effect({dispatch:false})
  createCoupon$ = this.actions$
    .pipe(
      ofType<AddCoupon>(CouponActionTypes.AddCoupon),
      concatMap(action => this.dbCoupons.createNewCoupon(action.payload.coupon.courseId, action.payload.coupon))
    );

  constructor(
    private actions$: Actions,
    private dbCoupons: CourseCouponsDbService,
    private store: Store<AppState>,
    private messages: MessagesService,
    private loading: LoadingService) {

  }

}
