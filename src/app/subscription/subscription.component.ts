import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AppState} from '../store';
import {of} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {
  arePricingPlansReady,
  isConnectedToStripe,
  platformState, pricingPlansState,
  selectUser,
  selectUserPermissions
} from '../store/selectors';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StripeConnectionService} from '../services/stripe-connection.service';
import {PricingPlansLoaded} from '../store/pricing-plans.actions';
import {MessagesService} from '../services/messages.service';
import {LoadingService} from '../services/loading.service';
import {PricingPlansState} from '../store/pricing-plans.reducer';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import {PricingPlan} from '../models/pricing-plan.model';
import {EditPricingPlanDialogComponent} from '../edit-subscriptions-dialog/edit-pricing-plan-dialog.component';
import {concatMap, filter, finalize, map, tap, withLatestFrom} from 'rxjs/operators';
import {promise} from 'selenium-webdriver';
import {environment} from '../../environments/environment';
import {PaymentsService} from '../services/payments.service';
import {PlanActivated} from '../store/user.actions';
import {planNames} from '../common/text';

import * as firebase from 'firebase/app';
import {UserPermissions} from '../models/user-permissions.model';
import {isAnonymousUser, isUserPlanCanceled, isUserPlanStillValid, User} from '../models/user.model';
import {GetSubscriptionContent, SubscriptionContentUpdated} from '../store/content.actions';
import {SubscriptionContent} from '../models/content/subscription-content.model';
import {selectContent} from '../store/content.selectors';
import {EditHtmlDialogComponent} from '../edit-html-dialog/edit-html-dialog.component';
import {ContentDbService} from '../services/content-db.service';
import {ActivatedRoute} from '@angular/router';
import {LoadingDialogComponent} from '../loading-dialog/loading-dialog.component';
import {PurchasesService} from '../services/purchases.service';
import {PurchaseSession} from '../models/purchase-session.model';
import {FAQ} from '../models/content/faq.model';
import {setSchoolNameAsPageTitle} from '../common/seo-utils';
import {Title} from '@angular/platform-browser';


declare const Stripe;

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
  subscriptionContent$: Observable<SubscriptionContent>;

  showConnectToStripe = false;

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
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private purchases: PurchasesService,
    private title: Title) {

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

    this.plans$ = this.store.pipe(select(pricingPlansState));

    this.arePricingPlansReady$ = this.store.pipe(select(arePricingPlansReady));

    this.userPermissions$ = this.store.pipe(select(selectUserPermissions));

    this.user$ = this.store.pipe(select(selectUser));

    this.subscriptionContent$ = this.store.pipe(select(selectContent('subscription')));

    this.route.queryParamMap.subscribe(params => {

      const purchaseResult = params.get('purchaseResult'),
        ongoingPurchaseSessionId = params.get('ongoingPurchaseSessionId');

      window.history.replaceState(null, null, window.location.pathname);

      if (purchaseResult == 'success') {
        this.processPurchaseCompletion(ongoingPurchaseSessionId);
      } else if (purchaseResult == 'failure') {
        this.messages.error('Payment failed, please check your card balance.');
      }

    });

    setSchoolNameAsPageTitle(this.store, this.title);

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

  editPlan(allPlans: PricingPlansState, planName: string, editPlanName: boolean, editUndiscountedPrice: boolean, updateStripePlan: boolean) {

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
            this.messages.info('Pricing plan updated successfully.');
          }
        }
      );
  }

  activateSubscription(plan: PricingPlan, userPermissions: UserPermissions, user:User) {

    if (isAnonymousUser(user)) {
      this.messages.info("Please login first. You can use social login (Gmail, Twitter, etc.) or email and password if you prefer.");
      return;
    }

    if (userPermissions.isAdmin) {
      this.messages.info('Students will be able to subscribe using this button.');
      return;
    }

    this.selectedPlan = plan;

    const oneTimeCharge = this.selectedPlan.frequency == 'lifetime',
      subscriptionUrl = `${window.location.protocol}//${window.location.host}/subscription`;

    let buyPlan$ = this.payments.createActivatePlanSession(this.selectedPlan, oneTimeCharge, subscriptionUrl);

    this.loading.showLoaderUntilCompleted(buyPlan$)
      .subscribe(session => {

          const stripe = Stripe(session.stripePublicKey, {stripeAccount: session.stripeTenantUserId});

          stripe.redirectToCheckout({
            sessionId: session.sessionId
          });

        },
        err => {
          console.log('Error creating subscription session:', err);
          this.messages.error('Could not create subscription, please contact support.');
        });

  }

  monthlyPlanButtonText(user: User) {
    if (user.pricingPlan == 'month' && !isUserPlanCanceled(user)) {
      return 'Already Subscribed';
    }
    if (user.pricingPlan == 'year' && !isUserPlanCanceled(user)) {
      return 'Subscribed to Yearly';
    }

    if (user.pricingPlan == 'lifetime') {
      return 'Subscribed to Lifetime';
    }

    return 'Access All Courses';
  }

  yearlyPlanButtonText(user: User) {
    if (user.pricingPlan == 'month' && !isUserPlanCanceled(user)) {
      return 'Upgrade to Yearly';
    }
    if (user.pricingPlan == 'year' && !isUserPlanCanceled(user)) {
      return 'Already Subscribed';
    }

    if (user.pricingPlan == 'lifetime') {
      return 'Subscribed to Lifetime';
    }

    return 'Access All Courses';
  }

  lifetimePlanButtonText(user: User) {
    if (user.pricingPlan == 'month' && !isUserPlanCanceled(user)) {
      return 'Upgrade to Lifetime';
    }
    if (user.pricingPlan == 'year' && !isUserPlanCanceled(user)) {
      return 'Upgrade to Lifetime';
    }

    if (user.pricingPlan == 'lifetime') {
      return 'Already Subscribed';
    }

    return 'Access All Courses';
  }


  isMonthlyButtonActive(user: User) {
    return !user.pricingPlan || isUserPlanCanceled(user);
  }


  isYearlyButtonActive(user: User) {
    if (user.pricingPlan == 'month') {
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
    if (user.pricingPlan == 'month') {
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

  calculateYearlyDiscount(plans: PricingPlansState) {
    const unDiscountedYearlyPrice = plans.monthlyPlan.price * 12;
    return (unDiscountedYearlyPrice - plans.yearlyPlan.price) / unDiscountedYearlyPrice;

  }


  onContentEdited(content: SubscriptionContent) {
    this.store.dispatch(new SubscriptionContentUpdated({content}));
  }

  processPurchaseCompletion(ongoingPurchaseSessionId: string) {

    this.purchases.waitForPurchaseCompletion(
      ongoingPurchaseSessionId,
      'Subscription activated, you now have access to all courses!')
      .pipe(
        withLatestFrom(this.user$),
        concatMap(([purchaseSession, user]) => {
          // if the user upgraded to Lifetime, cancel the existing pricing plan in the background
          if (purchaseSession.plan == 'lifetime') {
            return this.payments.cancelPlan(user, "Upgraded to Lifetime").pipe(map(() => [purchaseSession, user]));
          }
          else return of([purchaseSession, user]);
        }),
        tap(([purchaseSession]: [PurchaseSession]) => {
          this.store.dispatch(new PlanActivated({
              selectedPlan: purchaseSession.plan,
              user: {
                planActivatedAt: firebase.firestore.Timestamp.fromMillis(new Date().getTime()),
                planEndsAt: null
              }
            })
          );
        })
      )
      .subscribe();

  }


}


