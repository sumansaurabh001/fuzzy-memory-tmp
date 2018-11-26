import {Component, Input, OnInit} from '@angular/core';
import {CourseCoupon} from '../models/coupon.model';
import {Course} from '../models/course.model';

@Component({
  selector: 'coupons-table',
  templateUrl: './coupons-table.component.html',
  styleUrls: ['./coupons-table.component.css']
})
export class CouponsTableComponent implements OnInit {

  displayedColumns = ['code', 'price', 'remaining', 'created', 'deadline', 'status'];

  @Input()
  courseCoupons: CourseCoupon[];

  @Input()
  course: Course;

  constructor() {

  }

  ngOnInit() {

  }

  createCoupon() {


  }

}
