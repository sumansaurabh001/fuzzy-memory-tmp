import {Injectable} from '@angular/core';
import {Actions, createEffect, Effect, ofType} from '@ngrx/effects';
import {catchError, concatMap, map, mergeMap, withLatestFrom} from 'rxjs/operators';
import {CourseCouponsDbService} from '../services/course-coupons-db.service';
import {select, Store} from '@ngrx/store';
import {isActiveCourseLessonsLoaded, selectActiveCourse} from './selectors';
import {AppState} from './index';
import {MessagesService} from '../services/messages.service';
import {LoadingService} from '../services/loading.service';
import {CourseCoupon} from '../models/coupon.model';
import {throwError} from 'rxjs';
import {CouponActions} from './action-types';
import {addCoupons, loadCouponCompleted} from './coupons.actions';

@Injectable({
  providedIn: 'root'
})
export class CouponEffects {

  loadCoupons$ = createEffect(() => this.actions$
    .pipe(
      ofType(CouponActions.loadCoupons),
      withLatestFrom(this.store.pipe(select(selectActiveCourse))),
      concatMap(([{activeCouponsOnly}, course]) => this.loading.showLoader<CourseCoupon[]>(
        this.dbCoupons.loadCoupons(course.id, activeCouponsOnly))),
      map(coupons => addCoupons({coupons})),
      catchError(err => {
        this.messages.error('Could not load course coupons.');
        return throwError(err);
      })
    ));


  loadCoupon$ = createEffect(() => this.actions$
    .pipe(
      ofType(CouponActions.loadCoupon),
      concatMap(({courseId, couponCode}) => this.loading.showLoader(this.dbCoupons.findCouponByCode(courseId, couponCode))),
      map(coupon => loadCouponCompleted({coupon}))
    ));


  saveCoupon$ = createEffect(() => this.actions$
    .pipe(
      ofType(CouponActions.updateCoupon),
      concatMap(({courseId,coupon}) => this.dbCoupons.saveCoupon(courseId, coupon.id, coupon.changes))
    ),
    {dispatch: false});


  createCoupon$ = createEffect(() => this.actions$
    .pipe(
      ofType(CouponActions.addCoupon),
      concatMap(({coupon}) => this.dbCoupons.createNewCoupon(coupon.courseId, coupon))
    ),
    {dispatch: false});


  constructor(
    private actions$: Actions,
    private dbCoupons: CourseCouponsDbService,
    private store: Store<AppState>,
    private messages: MessagesService,
    private loading: LoadingService) {

  }

}
