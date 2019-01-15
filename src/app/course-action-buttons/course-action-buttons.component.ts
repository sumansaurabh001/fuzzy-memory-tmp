import {Component, Input, OnInit} from '@angular/core';
import {Course} from '../models/course.model';

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

  constructor() { }

  ngOnInit() {

    this.checkoutHandler = StripeCheckout.configure({
      key: 'pk_test_5NQiVpv8GxwDJxKGilXmBK15',
      image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
      locale: 'auto',
      token: (token) => {


        const tokenId = token.id;


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
