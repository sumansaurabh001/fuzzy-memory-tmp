import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AppState} from '../store';
import {select, Store} from '@ngrx/store';
import {
  arePricingPlansReady,
  isConnectedToStripe,
  platformState,
  selectPricingPlans,
  selectUser,
  selectUserPermissions
} from '../store/selectors';
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
import {PlanActivated} from '../store/user.actions';
import {planNames} from '../common/text';

import * as firebase from "firebase/app";
import {UserPermissions} from '../models/user-permissions.model';
import {isUserPlanCanceled, isUserPlanStillValid, User} from '../models/user.model';
import {GetSubscriptionContent, SubscriptionContentUpdated} from '../store/content.actions';
import {SubscriptionContent} from '../models/content/subscription-content.model';
import {selectSubscriptionContent} from '../store/content.selectors';
import {EditHtmlDialogComponent} from '../edit-html-dialog/edit-html-dialog.component';
import {EditFaqEvent} from '../faqs/faq.events';
import {ContentDbService} from '../services/content-db.service';

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
  userPermissions$: Observable<UserPermissions>;
  user$: Observable<User>;
  subscriptionContent$:Observable<SubscriptionContent>;

  showConnectToStripe = false;

  checkoutHandler: any;

  selectedPlan: PricingPlan = null;

  dialogTitles = {
    monthlyPlan: 'Edit Monthly Plan',
    yearlyPlan: 'Edit Yearly Plan',
    lifetimePlan: 'Edit Lifetime Plan'
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
          oneTimeCharge = this.selectedPlan.frequency == 'lifetime';

        let buyPlan$ = this.payments.activatePlan(tokenId, paymentEmail, this.selectedPlan, oneTimeCharge);

        this.loading.showLoaderUntilCompleted(buyPlan$)
          .pipe(finalize(() => this.selectedPlan = null))
          .subscribe(
            (response) => {
              this.store.dispatch(new PlanActivated({
                selectedPlan: this.selectedPlan,
                user: {
                  planActivatedAt: firebase.firestore.Timestamp.fromMillis(response.planActivatedAt),
                  planEndsAt: null
                }
              })
            );
              this.messages.info('Payment successful, you now have access to all courses!');
            },
            err => {
              console.log('Payment failed, reason: ', err);
              this.messages.error("Payment failed, please check your card balance.");
            }
          );
      }
    });

    this.userPermissions$ = this.store.pipe(select(selectUserPermissions));

    this.user$ = this.store.pipe(select(selectUser));

    this.subscriptionContent$ = this.store.pipe(select(selectSubscriptionContent));

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

  editPlan(allPlans: PricingPlansState, planName: string, editPlanName:boolean, editUndiscountedPrice: boolean, updateStripePlan:boolean) {

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
      updateStripePlan

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

  activateSubscription(plan: PricingPlan, userPermissions: UserPermissions) {

    if (userPermissions.isAdmin) {
      this.messages.info("Students will be able to subscribe using this button.");
      return;
    }

    this.selectedPlan = plan;

    const description = planNames[plan.frequency];

    this.checkoutHandler.open({
      name: 'Angular University',
      description,
      currency: 'usd',
      amount: plan.price
    });

  }

  monthlyPlanButtonText(user:User) {
    if (user.pricingPlan == "month" && !isUserPlanCanceled(user)) {
      return "Already Subscribed";
    }
    if (user.pricingPlan == 'year' && !isUserPlanCanceled(user)) {
      return "Subscribed to Yearly"
    }

    if (user.pricingPlan == 'lifetime') {
      return "Subscribed to Lifetime";
    }

    return "Access All Courses";
  }

  yearlyPlanButtonText(user:User) {
    if (user.pricingPlan == "month" && !isUserPlanCanceled(user)) {
      return "Upgrade to Yearly";
    }
    if (user.pricingPlan == 'year' && !isUserPlanCanceled(user)) {
      return "Already Subscribed"
    }

    if (user.pricingPlan == 'lifetime') {
      return "Subscribed to Lifetime";
    }

    return "Access All Courses";
  }

  lifetimePlanButtonText(user:User) {
    if (user.pricingPlan == "month" && !isUserPlanCanceled(user)) {
      return "Upgrade to Lifetime";
    }
    if (user.pricingPlan == 'year' && !isUserPlanCanceled(user)) {
      return "Upgrade to Lifetime"
    }

    if (user.pricingPlan == 'lifetime') {
      return "Already Subscribed";
    }

    return "Access All Courses";
  }


  isMonthlyButtonActive(user: User) {
    return !user.pricingPlan || isUserPlanCanceled(user);
  }


  isYearlyButtonActive(user: User) {
    if (user.pricingPlan == "month") {
      return true;
    }
    if (user.pricingPlan == 'year' && !isUserPlanCanceled(user)) {
      return false;
    }
    if (user.pricingPlan == 'lifetime') {
      return false;
    }
    return true;
  }


  isLifetimeButtonActive(user: User) {
    if (user.pricingPlan == "month") {
      return true;
    }
    if (user.pricingPlan == 'year') {
      return true;
    }

    if (user.pricingPlan == 'lifetime') {
      return false;
    }
    return true;
  }

  calculateYearlyDiscount(plans:PricingPlansState) {
    const unDiscountedYearlyPrice = plans.monthlyPlan.price * 12;
    return (unDiscountedYearlyPrice - plans.yearlyPlan.price) / unDiscountedYearlyPrice;

  }


  onBenefitsEdited(subscriptionContent:SubscriptionContent) {
    this.store.dispatch(new SubscriptionContentUpdated({subscriptionContent}));
  }


  onFaqEdited(content: SubscriptionContent, event: EditFaqEvent) {

    const subscriptionContent:SubscriptionContent = {
      ...content,
      faqs: content.faqs.slice(0)
    };

    subscriptionContent.faqs[event.index] = event.faq;

    this.store.dispatch(new SubscriptionContentUpdated({subscriptionContent}));

  }

  onFaqAdded(content: SubscriptionContent, event: EditFaqEvent) {

    const subscriptionContent:SubscriptionContent = {
      ...content,
      faqs: content.faqs.slice(0)
    };

    subscriptionContent.faqs.push(event.faq);

    this.store.dispatch(new SubscriptionContentUpdated({subscriptionContent}));
  }

  onFaqDeleted(content: SubscriptionContent, event: EditFaqEvent) {

    const subscriptionContent:SubscriptionContent = {
      ...content,
      faqs: content.faqs.slice(0)
    };

    subscriptionContent.faqs.splice(event.index, 1);

    this.store.dispatch(new SubscriptionContentUpdated({subscriptionContent}));


  }

}


