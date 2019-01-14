import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'stripe-connection-response',
  templateUrl: './stripe-connection-response.component.html',
  styleUrls: ['./stripe-connection-response.component.css']
})
export class StripeConnectionResponseComponent implements OnInit {

  constructor(private route: ActivatedRoute, private cookies: CookieService) { }

  ngOnInit() {

    const stripeRequestingDomain = this.cookies.get('STRIPE_REQUESTING_DOMAIN');

    this.cookies.delete('STRIPE_REQUESTING_DOMAIN');

    // redirect the user back to the domain that requested to be connected to Stripe, and send also the stripe response parameters
    const redirectUrl = `${stripeRequestingDomain}/stripe-redirect${window.location.search}`;

    window.location.href = redirectUrl;

  }



}
