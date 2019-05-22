import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CourseCoupon} from '../models/coupon.model';
import {Course} from '../models/course.model';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {AddCouponDialogComponent} from '../add-coupon-dialog/add-coupon-dialog.component';
import {GetLinkDialogComponent} from '../get-link-dialog/get-link-dialog.component';


@Component({
  selector: 'coupons-table',
  templateUrl: './coupons-table.component.html',
  styleUrls: ['./coupons-table.component.css']
})
export class CouponsTableComponent implements OnInit {

  displayedColumns = ['code', 'link', 'price', 'remaining', 'deadline', 'status'];

  @Input()
  courseCoupons: CourseCoupon[];

  @Input()
  course: Course;

  @Output()
  toggleCoupon = new EventEmitter<CourseCoupon>();

  constructor(private dialog: MatDialog) {

  }

  ngOnInit() {

  }

  couponsExist() {
    return this.courseCoupons && this.courseCoupons.length > 0;
  }

  createCoupon() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.minWidth = '600px';
    dialogConfig.data = {course: this.course};

    const dialogRef = this.dialog.open(AddCouponDialogComponent, dialogConfig);

    dialogRef.afterClosed()
      .pipe(

      );

  }

  onToggleCouponActive(coupon:CourseCoupon) {
    this.toggleCoupon.emit(coupon);
  }

  getCouponLink(coupon: CourseCoupon) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.minWidth = '600px';
    dialogConfig.data = {coupon, course:this.course};

    this.dialog.open(GetLinkDialogComponent, dialogConfig);

  }

}
