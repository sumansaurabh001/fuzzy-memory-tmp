import {Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {Course} from '../models/course.model';
import {PaymentsService} from '../services/payments.service';
import {MessagesService} from '../services/messages.service';
import {environment} from '../../environments/environment';
import {LoadingService} from '../services/loading.service';
import {AppState} from '../store';
import {select, Store} from '@ngrx/store';
import {CoursePurchased} from '../store/course.actions';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {isAdmin} from '../store/selectors';
import {User} from '../models/user.model';

declare const StripeCheckout;

@Component({
  selector: 'course-action-buttons',
  templateUrl: './course-action-buttons.component.html',
  styleUrls: ['./course-action-buttons.component.scss']
})
export class CourseActionButtonsComponent implements OnInit, OnChanges {

  @Input()
  course:Course;

  @Input()
  user:User;

  @Input()
  userCourses: string[];

  showPurchaseButtons:boolean;

  isAdmin: boolean;

  checkoutHandler: any;

  constructor(
    private payments: PaymentsService,
    private messages: MessagesService,
    private loading: LoadingService,
    private store: Store<AppState>,
    private router: Router) {

  }


  ngOnInit() {

    this.checkoutHandler = StripeCheckout.configure({
      key: environment.stripe.stripePublicKey,
      image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
      locale: 'auto',
      token: (token) => {

        const tokenId = token.id,
              paymentEmail = token.email,
              purchaseCourse$ = this.payments.purchaseCourse(tokenId, paymentEmail, this.course.id);

        this.loading.showLoaderUntilCompleted(purchaseCourse$)
          .subscribe(
            () => {
              this.store.dispatch(new CoursePurchased({courseId: this.course.id}));
              this.messages.success('Payment successful, please enjoy the course!');
            },
            err => {
              console.log('Payment failed, reason: ', err);
              this.messages.error("Payment failed, please check your card balance.");
            }
          );
      }
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

    this.checkoutHandler.open({
      name: 'Angular University',
      description:this.course.title,
      currency: 'usd',
      amount: this.course.price * 100
    });

  }

  updatePurchaseButtonsVisibility() {

    debugger;

    const userOwnsCourse = this.course && (this.userCourses.includes(this.course.id) || this.user.pricingPlan);

    this.showPurchaseButtons =  !this.isAdmin && !userOwnsCourse;
  }


  start() {

    this.router.navigateByUrl(`courses/${this.course.url}/1/lessons/1`);

  }


}
