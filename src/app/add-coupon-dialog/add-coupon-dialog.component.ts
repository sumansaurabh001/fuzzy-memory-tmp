import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {URL_PATH_REGEX} from '../common/regex';
import {MessagesService} from '../services/messages.service';
import {Course} from '../models/course.model';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from '../store';
import {AddCourse} from '../store/course.actions';
import {CoursesDBService} from '../services/courses-db.service';
import {LoadingService} from '../services/loading.service';
import {CourseCoupon} from '../models/coupon.model';
import {CourseCouponsDbService} from '../services/course-coupons-db.service';



@Component({
  selector: 'add-course-dialog',
  templateUrl: './add-coupon-dialog.component.html',
  styleUrls: ['./add-coupon-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    MessagesService
  ]
})
export class AddCouponDialogComponent implements OnInit {

  form: FormGroup;

  course:Course;

  constructor(private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) data,
              private dialogRef: MatDialogRef<AddCouponDialogComponent>,
              private loading: LoadingService,
              private couponsDB: CourseCouponsDbService,
              private messages: MessagesService) {

    this.course = data.course;

  }

  ngOnInit() {
    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(20)]]
    });
  }

  close() {
    this.dialogRef.close();
  }

  save() {

    const coupon = this.form.value as CourseCoupon;
    coupon.active = true;

    this.loading.showLoader(this.couponsDB.createNewCoupon(this.course.id, coupon))
      .subscribe(() => {

          this.dialogRef.close();
        },
        err => this.messages.error(err));

  }


}
