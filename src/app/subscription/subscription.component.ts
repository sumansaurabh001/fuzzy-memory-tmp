import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AppState} from '../store';
import {select, Store} from '@ngrx/store';
import {arePricingPlansReady, isConnectedToStripe} from '../store/selectors';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StripeConnectionService} from '../services/stripe-connection.service';
import {PricingPlansLoaded} from '../store/pricing-plans.actions';
import {MessagesService} from '../services/messages.service';
import {LoadingService} from '../services/loading.service';

@Component({
  selector: 'subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  form: FormGroup;


  isConnectedToStripe$: Observable<boolean>;
  arePricingPlansReady$: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private stripe: StripeConnectionService,
    private messages: MessagesService,
    private loading: LoadingService) {

    this.form = this.fb.group({
      monthlyPlanDescription: ['', Validators.required],
      yearlyPlanDescription: ['', Validators.required],
      monthlyPlanPrice: [9.99, Validators.required],
      yearlyPlanPrice: [99, Validators.required],
      lifetimeAccessPrice: [399, Validators.required]
    });

  }



  ngOnInit() {

    this.isConnectedToStripe$ = this.store.pipe(select(isConnectedToStripe));

    this.arePricingPlansReady$ = this.store.pipe(select(arePricingPlansReady));

  }

  setupPricingPlans() {

    const val = this.form.value;

    const setupPlans$ = this.stripe.setupDefaultPricingPlans(val.monthlyPlanDescription, val.yearlyPlanDescription, val.monthlyPlanPrice * 100, val.yearlyPlanPrice * 100, val.lifetimeAccessPrice * 100);

    this.loading.showLoader(setupPlans$)
      .subscribe(
        pricingPlans => this.store.dispatch(new PricingPlansLoaded({pricingPlans})),
        err => {
          console.log('Error setting up plans:', err);
          this.messages.error('Error setting up pricing plans.');
        }
      );

  }

}
