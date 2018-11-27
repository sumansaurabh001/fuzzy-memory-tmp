import {Injectable} from '@angular/core';
import {CourseCouponsDbService} from '../services/course-coupons-db.service';
import {Observable} from '../../../node_modules/rxjs/Observable';
import {CourseCoupon} from '../models/coupon.model';
import {map, mergeMap, startWith, tap} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {LoadingService} from '../services/loading.service';
import {select, Store} from '@ngrx/store';
import {selectActiveCourse} from '../store/selectors';
import {Course} from '../models/course.model';
import {AppState} from '../store';


@Injectable({
  providedIn: 'root'
})
export class CourseCouponsService {

  private subject = new BehaviorSubject<CourseCoupon[]>([]);

  private course$: Observable<Course>;

  coupons$: Observable<CourseCoupon[]> = this.subject.asObservable();

  loadingCoupons$: Observable<boolean>;


  constructor(
    private couponsDB: CourseCouponsDbService,
    private loading: LoadingService,
    private store: Store<AppState>) {

    this.course$ = this.store.pipe(select(selectActiveCourse));

  }

  loadCoupons(activeCouponsOnly:boolean) {
    this.coupons$ = this.loading.showLoader(
      this.course$
        .pipe(
          mergeMap(course => this.couponsDB.loadCoupons(course.id, activeCouponsOnly)),
          tap(coupons => this.subject.next(coupons))
        )
    );

    this.loadingCoupons$ = this.coupons$
      .pipe(
        startWith(true),
        map(coupons => !coupons)
      );

    return this.coupons$;
  }


  createNewCoupon(courseId: string, newCoupon: CourseCoupon) {
    return this.loading.showLoader(
      this.couponsDB.createNewCoupon(courseId, newCoupon)
        .pipe(
          tap(coupon => {
            const coupons = [...this.subject.getValue()];

            coupons.unshift(coupon);

            this.subject.next(coupons);
          })
        )
    );
  }

  toggleCoupon(coupon: CourseCoupon) {

  }

}
