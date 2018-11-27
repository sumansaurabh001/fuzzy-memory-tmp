import { Component, OnInit } from '@angular/core';
import {CourseCouponsDbService} from '../services/course-coupons-db.service';
import {CourseCoupon} from '../models/coupon.model';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store';
import {Observable} from 'rxjs/Observable';
import {selectActiveCourse} from '../store/selectors';
import {Course} from '../models/course.model';
import {mergeMap} from 'rxjs/operators';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'price-and-coupons',
  templateUrl: './price-and-coupons.component.html',
  styleUrls: ['./price-and-coupons.component.css']
})
export class PriceAndCouponsComponent implements OnInit {

  course$: Observable<Course>;

  coupons$: Observable<CourseCoupon[]>;

  form: FormGroup;

  priceControl = new FormControl('', Validators.required);

  includedControl = new FormControl(true, Validators.required);

  priceGroup = new FormGroup({
    price: this.priceControl,
    includedInSubscription: this.includedControl
  });

  constructor(
    private couponsDB: CourseCouponsDbService,
    private store: Store<AppState>,
    private fb: FormBuilder) {

    this.form = this.fb.group({
      free: [false, [Validators.required]],
      priceGroup: this.priceGroup
    });

  }

  ngOnInit() {

    this.course$ = this.store.pipe(select(selectActiveCourse));

    this.coupons$ = this.course$.pipe(mergeMap(course => this.couponsDB.loadActiveCoupons(course.id)));

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

}
