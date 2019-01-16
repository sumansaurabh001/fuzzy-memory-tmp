import {Component, Input, OnInit} from '@angular/core';
import {Course} from '../models/course.model';
import {PaymentsService} from '../services/payments.service';
import {MessagesService} from '../services/messages.service';
import {environment} from '../../environments/environment';
import {LoadingService} from '../services/loading.service';

declare const StripeCheckout;

@Component({
  selector: 'course-action-buttons',
  templateUrl: './course-action-buttons.component.html',
  styleUrls: ['./course-action-buttons.component.scss']
})
export class CourseActionButtonsComponent implements OnInit {

  @Input()
  course:Course;

  checkoutHandler: any;

  constructor(
    private payments: PaymentsService,
    private messages: MessagesService,
    private loading: LoadingService) {

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
            () => this.messages.success('Payment successful, please enjoy the course!'),
            err => {
              console.log('Payment failed, reason: ', err);
              this.messages.error("Payment failed, please check your card balance.");
            }
          );
      }
    });

  }

  buyCourse() {

    this.checkoutHandler.open({
      name: 'Angular University',
      description:this.course.title,
      currency: 'usd',
      amount: this.course.price * 100
    });

  }

}
