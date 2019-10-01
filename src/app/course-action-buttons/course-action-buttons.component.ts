import {Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {Course} from '../models/course.model';
import {PaymentsService} from '../services/payments.service';
import {MessagesService} from '../services/messages.service';
import {environment} from '../../environments/environment';
import {LoadingService} from '../services/loading.service';
import {AppState} from '../store';
import {select, Store} from '@ngrx/store';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {isAdmin, selectUser, selectUserCoursesIds} from '../store/selectors';
import {isAnonymousUser, User} from '../models/user.model';
import {CourseCoupon} from '../models/coupon.model';


declare const Stripe;

@Component({
  selector: 'course-action-buttons',
  templateUrl: './course-action-buttons.component.html',
  styleUrls: ['./course-action-buttons.component.scss']
})
export class CourseActionButtonsComponent implements OnInit, OnChanges {

  @Input()
  course: Course;

  @Input()
  coupon: CourseCoupon;

  user: User;

  userCourses: string[] = [];

  showPurchaseButtons: boolean;

  isAdmin: boolean;

  constructor(
    private payments: PaymentsService,
    private messages: MessagesService,
    private loading: LoadingService,
    private store: Store<AppState>,
    private router: Router) {

  }

  ngOnInit() {

    this.store.pipe(select(selectUser))
      .subscribe(user => {
        this.user = user;
        this.updatePurchaseButtonsVisibility();
      });

    this.store.pipe(select(selectUserCoursesIds))
      .subscribe(userCourses => {
        this.userCourses = userCourses;
        this.updatePurchaseButtonsVisibility();
      });

    this.store.pipe(select(isAdmin))
      .subscribe(isAdmin => {

        this.isAdmin = isAdmin;

        this.updatePurchaseButtonsVisibility();

      });

  }

  ngOnChanges(changes: SimpleChanges) {
    this.updatePurchaseButtonsVisibility();
  }


  buyCourse() {

    if (isAnonymousUser(this.user)) {
      this.messages.info('Please login first. You can use social login (Gmail, Twitter, etc.) or email and password if you prefer.');
      return;
    }

    this.messages.info("Preparing checkout, please wait ...");

    const courseUrl =  `${window.location.protocol}//${window.location.host}/courses/${this.course.url}`;

    const purchaseCourseSession$ = this.payments.createPurchaseCourseSession(
      this.course.id,
      courseUrl,
      this.coupon ? this.coupon.code : null);

    this.loading.showLoaderUntilCompleted(purchaseCourseSession$)
      .subscribe(session => {

        const stripe = Stripe(session.stripePublicKey, {stripeAccount: session.stripeTenantUserId});

        stripe.redirectToCheckout({
          sessionId: session.sessionId,
        });

      });

  }

  updatePurchaseButtonsVisibility() {

    const userOwnsCourse = this.course && (this.userCourses.includes(this.course.id) || this.user && this.user.pricingPlan);

    this.showPurchaseButtons = !this.course.free && ( !this.user || (!this.isAdmin && !userOwnsCourse) );

  }

  start() {

    if (isAnonymousUser(this.user)) {
      this.messages.info('Please login first. You can use social login (Gmail, Twitter, etc.) or email and password if you prefer.');
      return;
    }

    this.router.navigateByUrl(`courses/${this.course.url}/1/lessons/1`);

  }

}

