import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {MessagesService} from '../services/messages.service';
import {LoadingService} from '../services/loading.service';
import {TenantsDBService} from '../services/tenants-db.service';
import {StripeConnectionService} from '../services/stripe-connection.service';

@Component({
  selector: 'stripe-redirect-page',
  templateUrl: './stripe-redirect-page.component.html',
  styleUrls: ['./stripe-redirect-page.component.css']
})
export class StripeRedirectPageComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private messages: MessagesService,
    private router: Router,
    private loading: LoadingService,
    private stripeConnectionService: StripeConnectionService) {

  }

  ngOnInit() {

    this.messages.info('Connecting to Stripe, this could take about 1 minute...');

    this.loading.loadingOn();

    const scope = this.route.snapshot.queryParamMap.get('scope');

    const error = this.route.snapshot.queryParamMap.get('error');

    if (scope === 'read_write') {
      this.handleStripeConnectionSuccessful();
    }
    else if (error) {
      this.handleStripeConnectionFailed(error);
    }
    else {
      this.messages.warn('An unknown Stripe reply was received, the Stripe connection is NOT active.');
      this.navigateToCourses();

    }

  }

  handleStripeConnectionSuccessful() {

    const authorizationCode = this.route.snapshot.queryParamMap.get('code');

    this.stripeConnectionService.initStripeConnection(authorizationCode)
      .subscribe(
        () => {
          this.messages.success("Stripe connection Successful, you are ready to accept payments.");
          this.navigateToCourses();
        },
        err => {
          console.log("Could not initialize the Stripe connection", err);
          this.messages.error(`The Stripe connection attempt has failed.`);
          this.navigateToCourses();
        }
      );

  }

  handleStripeConnectionFailed(error:string) {

    const errorDescription = this.route.snapshot.queryParamMap.get('error_description');

    console.log("Could not retrieve Stripe credentials:", error);

    this.messages.error(`Error connecting to Stripe - ${errorDescription}`);

    this.navigateToCourses();

  }

  navigateToCourses() {
    this.loading.loadingOff();
    this.router.navigateByUrl('/courses');
  }


}
