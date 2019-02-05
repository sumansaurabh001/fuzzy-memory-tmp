import {Component, Input, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';


@Component({
  selector: 'connect-with-stripe',
  templateUrl: './connect-with-stripe.component.html',
  styleUrls: ['./connect-with-stripe.component.css']
})
export class ConnectWithStripeComponent implements OnInit {

  @Input()
  message:string;

  constructor() {
  }

  ngOnInit() {

  }


  connectWithStripe() {

    const urlSubdomains = window.location.hostname.split('.'),
      topLevelSubdomain = urlSubdomains[urlSubdomains.length - 1],
      port = window.location.port,
      protocol = window.location.protocol.replace(':','');

    // this is the domain requesting to connection with Stripe, for example https://online-course-5000.onlinecoursehost.com
    const stripeRequestingDomain = window.location.host;

    // before going to stripe connect, first we need to go to an intermediate connection page in the app.onlinecoursehost.* platform domain
    let stripeConnectionRequestUrl = `${protocol}://app.onlinecoursehost.${topLevelSubdomain}`;

    if (port) {
      stripeConnectionRequestUrl += `:${port}`;
    }

    stripeConnectionRequestUrl += `/stripe-connection-request?stripeRequestingDomain=${stripeRequestingDomain}&protocol=${protocol}`;

    window.location.href = stripeConnectionRequestUrl;

  }


}
