import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {AddCoupons, CouponActionTypes, LoadCoupons} from './coupons.actions';
import {catchError, map, mergeMap, withLatestFrom} from 'rxjs/operators';
import {CourseCouponsDbService} from '../services/course-coupons-db.service';
import {select, Store} from '@ngrx/store';
import {isActiveCourseLessonsLoaded, selectActiveCourse} from './selectors';
import {AppState} from './index';
import {_throw} from '../../../node_modules/rxjs-compat/observable/throw';
import {MessagesService} from '../services/messages.service';


@Injectable({
  providedIn: 'root'
})
export class CouponEffects {


  @Effect()
  loadCoupons$ = this.actions$
    .ofType<LoadCoupons>(CouponActionTypes.LoadCoupons)
    .pipe(
      withLatestFrom(this.store.pipe(select(selectActiveCourse))),
      mergeMap(([action, course]) => this.dbCoupons.loadCoupons(course.id, action.payload.activeCouponsOnly)),
      map(coupons => new AddCoupons({coupons})),
      catchError(err => {
        this.messages.error('Could not load course coupons.');
        return _throw(err);
      })
    );


  constructor(
    private actions$: Actions,
    private dbCoupons: CourseCouponsDbService,
    private store: Store<AppState>,
    private messages: MessagesService) {

  }


}
