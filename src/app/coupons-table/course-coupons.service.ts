import {Injectable} from '@angular/core';
import {CourseCouponsDbService} from '../services/course-coupons-db.service';
import {Observable} from '../../../node_modules/rxjs/Observable';
import {CourseCoupon} from '../models/coupon.model';
import {filter, map, mergeMap, startWith, tap} from 'rxjs/operators';
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

  private subject = new BehaviorSubject<CourseCoupon[]>(undefined);

  private course$: Observable<Course>;

  coupons$: Observable<CourseCoupon[]> = this.subject.asObservable().pipe(filter(coupons => !!coupons));

  constructor(
    private couponsDB: CourseCouponsDbService,
    private loading: LoadingService,
    private store: Store<AppState>) {

    this.course$ = this.store.pipe(select(selectActiveCourse));

    this.loadCoupons(true);

  }

  loadCoupons(activeCouponsOnly:boolean) {
    const $loadCoupons = this.loading.showLoader(
      this.course$
        .pipe(
          mergeMap(course => this.couponsDB.loadCoupons(course.id, activeCouponsOnly)),
          tap(coupons => this.subject.next(coupons))
        )
    );

    $loadCoupons.subscribe();

    return this.coupons$;
  }


  createNewCoupon(courseId: string, newCoupon: CourseCoupon) {
    const createCoupon$ = this.loading.showLoader(
      this.couponsDB.createNewCoupon(courseId, newCoupon)
        .pipe(
          tap(coupon => {
            const coupons = [...this.subject.getValue()];

            coupons.unshift(coupon);

            this.subject.next(coupons);
          })
        )
    );

    createCoupon$.subscribe();

    return createCoupon$;

  }

  toggleCoupon(coupon: CourseCoupon) {

  }

}
