import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {environment} from '../../environments/environment';

/*
*
* We would like to connect the tenant user to stripe straight from his subdomain or custom domain, but this is not possible.
*
* This is because Stripe will redirect after a connection only to a whitelist of manually configured domains,
*
* but the problem is that the user tenant domain is not known upfront.
*
* To solve this, we will apply a couple of redirects. First the user comes to this page, coming from his tenant subdomain or custom domain.
*
* We will then create the Stripe connection from this page in the app.onlinecoursehost.* domain, and redirect the user back to his site.
*
* We will store the site that we need to redirect back to in a cookie, before showing to the user the Stripe Connect page.
*
*
* */


@Component({
  selector: 'stripe-connection-request',
  templateUrl: './stripe-connection-request.component.html',
  styleUrls: ['./stripe-connection-request.component.css']
})
export class StripeConnectionRequestComponent implements OnInit {

  constructor(private route: ActivatedRoute, private cookies: CookieService) { }

  ngOnInit() {

    // this is the identifier of the platform owner, who hosts the whole platform for tenants
    const stripeHostClientId = environment.stripe.stripeHostClientId;

    // This is the Stripe page that will allow the user to connect to Stripe
    const stripeConnectUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${stripeHostClientId}&scope=read_write`;

    const stripeRequestingUrl = this.route.snapshot.queryParamMap.get('protocol') + '://' + this.route.snapshot.queryParamMap.get('stripeRequestingDomain');

    // save the reply url in a cookie
    this.cookies.set('STRIPE_REQUESTING_DOMAIN', stripeRequestingUrl);

    // redirect to Stripe Connect connection page
    window.location.href = stripeConnectUrl;

  }

}
