import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
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
import * as firebase from 'firebase/app';
import {AddCoupon} from '../store/coupons.actions';
import {existingCouponCodeValidator} from './coupon-code.validator';
import {AngularFirestore} from '@angular/fire/firestore';



@Component({
  selector: 'add-course-dialog',
  templateUrl: './add-coupon-dialog.component.html',
  styleUrls: ['./add-coupon-dialog.component.scss'],
  providers: [
    MessagesService
  ]
})
export class AddCouponDialogComponent implements OnInit {

  form: FormGroup;

  course: Course;

  priceControl = new FormControl(null, Validators.required);

  couponCodeSyncValidators = [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern("^[a-zA-Z0-9-_]+$")];

  constructor(private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) data,
              private dialogRef: MatDialogRef<AddCouponDialogComponent>,
              private couponsDb: CourseCouponsDbService,
              private store: Store<AppState>,
              private messages: MessagesService,
              private afs: AngularFirestore) {

    this.course = data.course;

  }

  ngOnInit() {

    this.form = this.fb.group({
      code: ['', this.couponCodeSyncValidators, [existingCouponCodeValidator(this.couponsDb, this.course.id)] ],
      free: [false, Validators.required],
      price: this.priceControl,
      remaining: [null, Validators.required],
      deadline: [null]
    });

    this.form.valueChanges
      .subscribe((coupon:CourseCoupon) => {

        if (coupon.free) {
          this.priceControl.disable({emitEvent: false});
          this.priceControl.setValidators(null);
        }
        else {
          this.priceControl.enable({emitEvent:false});
          this.priceControl.setValidators(Validators.required);
        }

        this.priceControl.updateValueAndValidity({emitEvent: false});

      });

  }

  close() {
    this.dialogRef.close();
  }

  save() {

    const coupon = this.form.value as CourseCoupon;
    coupon.id = this.afs.createId();
    coupon.code = coupon.code.toUpperCase();
    coupon.active = true;
    coupon.courseId = this.course.id;
    coupon.created = firebase.firestore.Timestamp.fromDate(new Date());
    coupon.deadline = coupon.deadline ? firebase.firestore.Timestamp.fromDate(this.form.value.deadline) : null;

    this.store.dispatch(new AddCoupon({coupon}));

    this.dialogRef.close(coupon);



    this.couponsDb.createNewCoupon(this.course.id, coupon)
      .subscribe(
        coupon => {
        },
        err => this.messages.error(err)
    );

  }

  onFreeToggled(free:boolean) {
    if (free) {
      this.priceControl.setValue(null, {emitEvent:false});
    }
  }

  couponCodeExists() {
    return this.form.get('code').errors && this.form.get('code').errors.codeExists;
  }

  get today() {
    return new Date();
  }

}
