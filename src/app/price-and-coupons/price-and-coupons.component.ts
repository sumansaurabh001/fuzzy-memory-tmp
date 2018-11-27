import { Component, OnInit } from '@angular/core';
import {CourseCouponsDbService} from '../services/course-coupons-db.service';
import {CourseCoupon} from '../models/coupon.model';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store';
import {Observable} from 'rxjs/Observable';
import {selectActiveCourse} from '../store/selectors';
import {Course} from '../models/course.model';
import {map, mergeMap, startWith} from 'rxjs/operators';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {LoadingService} from '../services/loading.service';
import {CourseCouponsService} from '../coupons-table/course-coupons.service';

@Component({
  selector: 'price-and-coupons',
  templateUrl: './price-and-coupons.component.html',
  styleUrls: ['./price-and-coupons.component.css'],
  providers: [
    LoadingService,
    CourseCouponsService
  ]
})
export class PriceAndCouponsComponent implements OnInit {

  course$: Observable<Course>;

  coupons$: Observable<CourseCoupon[]>;

  loadingCoupons$: Observable<boolean>;

  form: FormGroup;

  priceControl = new FormControl('', Validators.required);

  includedControl = new FormControl(true, Validators.required);

  priceGroup = new FormGroup({
    price: this.priceControl,
    includedInSubscription: this.includedControl
  });

  activeCouponsOnly = true;

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private couponsService: CourseCouponsService) {

    this.form = this.fb.group({
      free: [false, [Validators.required]],
      priceGroup: this.priceGroup
    });

  }

  ngOnInit() {

    this.course$ = this.store.pipe(select(selectActiveCourse));

    this.coupons$ = this.couponsService.loadCoupons(true);
    this.loadingCoupons$ = this.couponsService.loadingCoupons$;

    this.couponsService.loadCoupons(true);

    this.course$.subscribe(course => {
      if (course) {
        this.form.patchValue(course)
      }
    });

    this.form.valueChanges
      .subscribe((val:Course) => {

        if (val.free) {
          this.priceGroup.disable({emitEvent:false});
        }
        else {
          this.priceGroup.enable({emitEvent:false});
        }

      });

  }
  onToggleFilter() {
    this.activeCouponsOnly = !this.activeCouponsOnly;
    this.coupons$ = this.couponsService.loadCoupons(this.activeCouponsOnly);
  }

  onCouponToggled(coupon: CourseCoupon) {
    this.couponsService.toggleCoupon(coupon);
  }


}
