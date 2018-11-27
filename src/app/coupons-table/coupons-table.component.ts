import {Component, Input, OnInit} from '@angular/core';
import {CourseCoupon} from '../models/coupon.model';
import {Course} from '../models/course.model';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {AddCouponDialogComponent} from '../add-coupon-dialog/add-coupon-dialog.component';

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

  constructor(private dialog: MatDialog) {

  }

  ngOnInit() {

  }

  createCoupon() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.minWidth = '600px';
    dialogConfig.data = {course: this.course};

    const dialogRef = this.dialog.open(AddCouponDialogComponent, dialogConfig);

  }

}
