import { Component, OnInit } from '@angular/core';
import {CourseCouponsDbService} from '../services/course-coupons-db.service';
import {CourseCoupon} from '../models/coupon.model';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store';
import {Observable} from 'rxjs/Observable';
import {selectActiveCourse} from '../store/selectors';
import {Course} from '../models/course.model';
import {mergeMap} from 'rxjs/operators';

@Component({
  selector: 'price-and-coupons',
  templateUrl: './price-and-coupons.component.html',
  styleUrls: ['./price-and-coupons.component.css']
})
export class PriceAndCouponsComponent implements OnInit {

  course$: Observable<Course>;

  coupons$: Observable<CourseCoupon[]>;

  constructor(private couponsDB: CourseCouponsDbService, private store: Store<AppState>) { }

  ngOnInit() {

    this.course$ = this.store.pipe(select(selectActiveCourse));

    this.coupons$ = this.course$.pipe(mergeMap(course => this.couponsDB.loadActiveCoupons(course.id)));

  }

}
