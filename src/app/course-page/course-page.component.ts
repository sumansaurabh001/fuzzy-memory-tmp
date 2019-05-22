import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store';
import {Course} from '../models/course.model';
import {Observable, BehaviorSubject} from 'rxjs';
import {
  isAdmin,
  selectActiveCourse, selectActiveCourseAllLessons, selectActiveCourseDescription,
  selectActiveCourseSections, selectUser, selectUserCoursesIds
} from '../store/selectors';
import {UrlBuilderService} from '../services/url-builder.service';
import {Lesson} from '../models/lesson.model';
import {CourseSection} from '../models/course-section.model';
import {filter, map, startWith, tap, withLatestFrom} from 'rxjs/operators';
import {CollapsibleTriggerComponent} from '../collapsible-trigger/collapsible-trigger.component';
import {sortSectionsBySeqNo} from '../common/sort-model';
import {User} from '../models/user.model';
import {ActivatedRoute} from '@angular/router';
import {MessagesService} from '../services/messages.service';
import {CoursePurchased} from '../store/course.actions';
import {PaymentsService} from '../services/payments.service';
import {PlanActivated} from '../store/user.actions';
import * as firebase from '../subscription/subscription.component';
import {PurchasesService} from '../services/purchases.service';
import {Title} from '@angular/platform-browser';
import {LoadCoupon} from '../store/coupons.actions';
import {CourseCoupon, isValidCoupon} from '../models/coupon.model';
import {selectCouponByCode} from '../store/coupon.selectors';

const DESCRIPTION_MAX_LENGTH = 1500;


@Component({
  selector: 'course',
  templateUrl: './course-page.component.html',
  styleUrls: ['./course-page.component.scss']
})
export class CoursePageComponent implements OnInit {

  course$: Observable<Course>;

  courseDescription$: Observable<string>;

  sections$: Observable<CourseSection[]>;

  lessons$: Observable<Lesson[]>;

  coupon$: Observable<CourseCoupon>;

  showFullDescription = false;

  couponCode:string;

  constructor(
    private store: Store<AppState>,
    private ub: UrlBuilderService,
    private route:ActivatedRoute,
    private messages:MessagesService,
    private purchases: PurchasesService,
    private title: Title) {

  }

  ngOnInit() {

    this.route.queryParamMap.subscribe(params => {

      const purchaseResult = params.get("purchaseResult");

      if (purchaseResult == "success") {

        const ongoingPurchaseSessionId = params.get("ongoingPurchaseSessionId"),
          courseId = params.get("courseId");

        window.history.replaceState(null, null, window.location.pathname);

        if (purchaseResult == 'success') {
          this.processPurchaseCompletion(ongoingPurchaseSessionId);
        } else if (purchaseResult == 'failure') {
          this.messages.error('Payment failed, please check your card balance.');
        }
      }
      else if (purchaseResult == "failure") {
        this.messages.error('Payment failed, please check your card balance.');
      }

      this.couponCode = params.get("couponCode");

    });

    this.course$ = this.store
      .pipe(
        select(selectActiveCourse),
        tap(course => {

          this.title.setTitle(course.title);

          if (this.couponCode) {
            this.store.dispatch(new LoadCoupon({courseId: course.id, couponCode: this.couponCode}));
          }

        })
    );

    this.coupon$ = this.store
      .pipe(
        select(selectCouponByCode(this.couponCode)),
        tap(coupon => {
          if (coupon && !isValidCoupon(coupon)) {
            this.messages.warn(`The coupon ${coupon.code} is no longer valid, please contact us to get a valid discount.`);
          }
        }),
        filter(isValidCoupon)
      );

    this.sections$ = this.store
      .pipe(
        select(selectActiveCourseSections),
        map(sortSectionsBySeqNo)
      );

    this.lessons$ = this.store.pipe(select(selectActiveCourseAllLessons));

    this.courseDescription$ = this.selectDescription();

  }

  selectDescription() {
    return this.store
      .pipe(
        select(selectActiveCourseDescription),
        filter(description => !!description),
        map(description => {

          return this.showFullDescription ? description : description.slice(0, description.indexOf('>', DESCRIPTION_MAX_LENGTH));

        })
      );
  }

  thumbnailUrl(course: Course) {
    return this.ub.buildCourseThumbailUrl(course);
  }

  toggleShowMore() {
    this.showFullDescription = true;
    this.courseDescription$ = this.selectDescription();

  }

  processPurchaseCompletion(ongoingPurchaseSessionId:string) {

    this.purchases.waitForPurchaseCompletion(
      ongoingPurchaseSessionId,
      'Payment successful, please enjoy the course!')
      .subscribe(purchaseSession => {

        this.store.dispatch(new CoursePurchased({courseId: purchaseSession.courseId}));

      });

  }

  calculateDiscountPercentage(course:Course, coupon: CourseCoupon) {
     return Math.round(100 * (course.price - coupon.price) / course.price);
  }


}
