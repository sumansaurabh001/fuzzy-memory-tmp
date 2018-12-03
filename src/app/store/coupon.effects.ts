import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {AddCoupons, CouponActionTypes, LoadCoupons, UpdateCoupon} from './coupons.actions';
import {catchError, map, mergeMap, withLatestFrom} from 'rxjs/operators';
import {CourseCouponsDbService} from '../services/course-coupons-db.service';
import {select, Store} from '@ngrx/store';
import {isActiveCourseLessonsLoaded, selectActiveCourse} from './selectors';
import {AppState} from './index';
import {_throw} from '../../../node_modules/rxjs-compat/observable/throw';
import {MessagesService} from '../services/messages.service';
import {LoadingService} from '../services/loading.service';
import {CourseCoupon} from '../models/coupon.model';


@Injectable({
  providedIn: 'root'
})
export class CouponEffects {


  @Effect()
  loadCoupons$ = this.actions$
    .ofType<LoadCoupons>(CouponActionTypes.LoadCoupons)
    .pipe(
      withLatestFrom(this.store.pipe(select(selectActiveCourse))),
      mergeMap(([action, course]) => this.loading.showLoader<CourseCoupon[]>(this.dbCoupons.loadCoupons(course.id, action.payload.activeCouponsOnly))),
      map(coupons => new AddCoupons({coupons})),
      catchError(err => {
        this.messages.error('Could not load course coupons.');
        return _throw(err);
      })
    );


  @Effect({dispatch:false})
  saveCoupon$ = this.actions$
    .ofType<UpdateCoupon>(CouponActionTypes.UpdateCoupon)
    .pipe(
      mergeMap(action => this.dbCoupons.saveCoupon(action.payload.courseId, action.payload.coupon.id ,action.payload.coupon.changes))
    );


  constructor(
    private actions$: Actions,
    private dbCoupons: CourseCouponsDbService,
    private store: Store<AppState>,
    private messages: MessagesService,
    private loading: LoadingService) {

  }


}
