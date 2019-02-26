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
import {filter, finalize, map, tap} from 'rxjs/operators';
import {promise} from 'selenium-webdriver';
import {environment} from '../../environments/environment';
import {CoursePurchased} from '../store/course.actions';
import {PaymentsService} from '../services/payments.service';
import {SubscriptionActivated} from '../store/user.actions';

declare const StripeCheckout;

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

  showConnectToStripe = false;

  checkoutHandler: any;

  selectedPlan: PricingPlan = null;

  dialogTitles = {
    monthlyPlan: 'Edit Monthly Plan',
    yearlyPlan: 'Edit Yearly Plan',
    lifetimePlan: 'Edit Lifetime Plan'
  };

  paymentModalTitle = {
    month: "Monthly Plan",
    year: "Yearly Plan",
    lifetime: "Lifetime Plan"
  };

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private stripe: StripeConnectionService,
    private messages: MessagesService,
    private loading: LoadingService,
    private payments: PaymentsService,
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
        map(platformState => platformState.isConnectedToStripe),
        tap(connected => {
          if (!connected) {
            this.showConnectToStripe = true;
          }
        })
      );

    this.plans$ = this.store.pipe(select(selectPricingPlans));

    this.arePricingPlansReady$ = this.store.pipe(select(arePricingPlansReady));

    this.checkoutHandler = StripeCheckout.configure({
      key: environment.stripe.stripePublicKey,
      image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
      locale: 'auto',
      token: (token) => {

        const tokenId = token.id,
          paymentEmail = token.email,
          purchaseSubscription$ = this.payments.purchaseSubscription(tokenId, paymentEmail, this.selectedPlan);

        this.loading.showLoaderUntilCompleted(purchaseSubscription$)
          .pipe(finalize(() => this.selectedPlan = null))
          .subscribe(
            () => {
              this.store.dispatch(new SubscriptionActivated({selectedPlan: this.selectedPlan}));
              this.messages.success('Payment successful, you now have access to all courses!');
            },
            err => {
              console.log('Payment failed, reason: ', err);
              this.messages.error("Payment failed, please check your card balance.");
            }
          );
      }
    });

  }

  setupPricingPlans() {

    const val = this.form.value;

    const setupPlans$ = this.stripe.setupDefaultPricingPlans(
      val.monthlyPlanDescription,
      val.yearlyPlanDescription,
      val.monthlyPlanPrice * 100, val.yearlyPlanPrice * 100,
      val.lifetimeAccessPrice * 100);

    this.loading.showLoader(setupPlans$)
      .subscribe(
        pricingPlans => this.store.dispatch(new PricingPlansLoaded({pricingPlans})),
        err => {
          console.log('Error setting up plans:', err);
          this.messages.error('Error setting up pricing plans.');
        }
      );

  }

  editPlan(allPlans: PricingPlansState, planName: string, editPlanName:boolean, editUndiscountedPrice: boolean) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.minWidth = '550px';
    dialogConfig.data = {
      dialogTitle: this.dialogTitles[planName],
      editPlanName,
      editUndiscountedPrice,
      planName,
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

  activateSubscription(plan: PricingPlan) {

    this.selectedPlan = plan;

    const description = this.paymentModalTitle[plan.frequency];

    this.checkoutHandler.open({
      name: 'Angular University',
      description,
      currency: 'usd',
      amount: plan.price
    });

  }

}


