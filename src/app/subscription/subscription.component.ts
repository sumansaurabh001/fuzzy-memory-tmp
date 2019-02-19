import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AppState} from '../store';
import {select, Store} from '@ngrx/store';
import {arePricingPlansReady, isConnectedToStripe, platformState, selectPricingPlans} from '../store/selectors';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StripeConnectionService} from '../services/stripe-connection.service';
import {PricingPlansLoaded} from '../store/pricing-plans.actions';
import {MessagesService} from '../services/messages.service';
import {LoadingService} from '../services/loading.service';
import {PricingPlansState} from '../store/pricing-plans.reducer';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {PricingPlan} from '../models/pricing-plan.model';
import {EditPricingPlanDialogComponent} from '../edit-subscriptions-dialog/edit-pricing-plan-dialog.component';
import {filter, map, tap} from 'rxjs/operators';
import {promise} from 'selenium-webdriver';


@Component({
  selector: 'subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  form: FormGroup;


  isConnectedToStripe$: Observable<boolean>;
  arePricingPlansReady$: Observable<boolean>;
  plans$: Observable<PricingPlansState>;

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private stripe: StripeConnectionService,
    private messages: MessagesService,
    private loading: LoadingService,
    private dialog: MatDialog) {

    this.form = this.fb.group({
      monthlyPlanDescription: ['', Validators.required],
      yearlyPlanDescription: ['', Validators.required],
      monthlyPlanPrice: [9.99, Validators.required],
      yearlyPlanPrice: [99, Validators.required],
      lifetimeAccessPrice: [399, Validators.required]
    });

  }



  ngOnInit() {

    this.isConnectedToStripe$ = this.store
      .pipe(
        select(platformState),
        filter(platformState => platformState.isConnectedToStripe !== null),
        tap(platformState => console.log(platformState)),
        map(platformState => platformState.isConnectedToStripe)
      );

    this.plans$ = this.store.pipe(select(selectPricingPlans));

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

  editPlan(allPlans: PricingPlansState, planName: string) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.minWidth = '500px';
    dialogConfig.data = {
      dialogTitle: 'Edit Monthly Plan',
      planName: "monthlyPlan",
      allPlans,

    };

    this.dialog.open(EditPricingPlanDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe(
        newPlan => {
          if (newPlan) {
            this.messages.info("Pricing plan updated successfully.");
          }
        }
      );


  }

}
