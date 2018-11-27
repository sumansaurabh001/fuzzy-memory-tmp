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

  constructor(
    private couponsDB: CourseCouponsDbService,
    private store: Store<AppState>,
    private fb: FormBuilder) {

    this.form = this.fb.group({
      price: this.priceControl,
      includedInSubscription: [true, [Validators.required]],
      free: [false, [Validators.required]]
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
          this.priceControl.disable({onlySelf:true, emitEvent:false});
        }
        else {
          this.priceControl.enable({onlySelf:true, emitEvent:false});
        }

      });

  }

}
