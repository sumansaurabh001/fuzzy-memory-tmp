import {Component, OnInit} from '@angular/core';
import {CourseCoupon} from '../models/coupon.model';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store';
import {Observable} from 'rxjs/Observable';
import {
  isConnectedToStripe,
  selectActiveCourse,
  selectActiveCourseCoupons,
  selectAllCoupons,
  selectAllCourseCoupons
} from '../store/selectors';
import {Course} from '../models/course.model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {LoadCoupons, UpdateCoupon} from '../store/coupons.actions';
import {Update, UpdateStr} from '../../../node_modules/@ngrx/entity/src/models';
import {MessagesService} from '../services/messages.service';
import {UpdateCourse} from '../store/course.actions';

@Component({
  selector: 'price-and-coupons',
  templateUrl: './price-and-coupons.component.html',
  styleUrls: ['./price-and-coupons.component.css'],
})
export class PriceAndCouponsComponent implements OnInit {

  course$: Observable<Course>;

  coupons$: Observable<CourseCoupon[]>;

  isConnectedToStripe$: Observable<boolean>;

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
    private messages: MessagesService) {

    this.form = this.fb.group({
      free: [false, [Validators.required]],
      priceGroup: this.priceGroup
    });

  }

  ngOnInit() {

    this.course$ = this.store.pipe(select(selectActiveCourse));

    this.coupons$ = this.store.pipe(select(selectActiveCourseCoupons));

    this.isConnectedToStripe$ = this.store.pipe(select(isConnectedToStripe));

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

    if (this.activeCouponsOnly) {
      this.coupons$ = this.store.pipe(select(selectActiveCourseCoupons));
      this.store.dispatch(new LoadCoupons({activeCouponsOnly:true}));
    }
    else {
      this.coupons$ = this.store.pipe(select(selectAllCourseCoupons));
      this.store.dispatch(new LoadCoupons({activeCouponsOnly:false}));
    }

  }

  onCouponToggled(coupon: CourseCoupon) {

    const update: UpdateStr<CourseCoupon> = {
      id: coupon.id,
      changes: {
        active: !coupon.active
      }
    };

    this.store.dispatch(new UpdateCoupon({courseId: coupon.courseId, coupon: update}));

  }


  save(courseId:string) {

    const val = this.form.value;

    const changes: Partial<Course> = {
      free: val.free,
      price: val.priceGroup.price,
      includedInSubscription: val.priceGroup.includedInSubscription

    };

    const course = {
      id: courseId,
      changes
    };

    this.store.dispatch(new UpdateCourse({course}));

  }


}
