import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {User} from '../models/user.model';
import {AppState} from '../store';
import {select, Store} from '@ngrx/store';
import {selectUser} from '../store/selectors';
import {planNames, teamPlanNames} from '../common/text';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {CancelSubscriptionDialogComponent} from '../cancel-subscription-dialog/cancel-subscription-dialog.component';

import * as dayjs from 'dayjs';
import {MessagesService} from '../services/messages.service';
import {setSchoolNameAsPageTitle} from '../common/seo-utils';
import {Title} from '@angular/platform-browser';
import {PaymentsService} from '../services/payments.service';
import {LoadingService} from '../services/loading.service';
import {ActivatedRoute} from '@angular/router';
import {coursePurchased} from '../store/course.actions';
import {PurchasesService} from '../services/purchases.service';
import {cardUpdated} from '../store/user.actions';

declare const Stripe;


@Component({
  selector: 'my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {

  user$: Observable<User>;

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private messages: MessagesService,
    private title: Title,
    private payments: PaymentsService,
    private loading: LoadingService,
    private route: ActivatedRoute,
    private purchases: PurchasesService) {

  }

  ngOnInit() {

    this.user$ = this.store.pipe(select(selectUser));

    setSchoolNameAsPageTitle(this.store, this.title);

    this.route.queryParamMap.subscribe(params => {

      const purchaseResult = params.get('cardUpdateResult');

      if (purchaseResult == 'success') {

        const ongoingPurchaseSessionId = params.get('ongoingPurchaseSessionId');

        window.history.replaceState(null, null, window.location.pathname);

        this.processCardUpdateCompletion(ongoingPurchaseSessionId);

      } else if (purchaseResult == 'failed') {
        this.messages.error('Credit card update failed, please try again.');
      }

    });

  }

  isSubscriptionActive(user: User) {
    return user && user.pricingPlan && (!user.planEndsAt || dayjs(user.planEndsAt.toMillis()).isAfter(dayjs()));
  }

  isSubscriptionCancelled(user: User) {
    return user && user.planEndsAt;
  }


  subscriptionDescr(user: User) {
    if (!user.pricingPlan) {
      return "None";
    }
    if (!user.isTeamPlan) {
      return planNames[user.pricingPlan];
    }
    if (user.isTeamPlan) {
      return teamPlanNames[user.pricingPlan];
    }
  }

  isLifetimeSubscriber(user: User) {
    return user.pricingPlan == 'lifetime';
  }

  activationDate(user) {
    return new Date(user.planActivatedAt.toMillis());
  }

  validUntil(user: User) {
    return new Date(user.planEndsAt.toMillis());
  }

  cancelPlan(user: User) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.minWidth = '550px';
    dialogConfig.data = {user};

    this.dialog.open(CancelSubscriptionDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe(
        result => {
          if (result) {
            this.messages.info('Plan canceled. We are sorry to see you go, you are welcome back anytime.');
          }
        });

  }

  cardExpiration(user: User) {
    return user && user.cardLast4Digits ? user.cardExpirationMonth + '/' + user.cardExpirationYear : '';
  }

  updateCard(user:User) {

    this.messages.info('Preparing to update card ...');

    const userSettingsUrl = `${window.location.protocol}//${window.location.host}/user-settings/my-account`;

    const updateCardSession$ = this.payments.createUpdateCardSession(userSettingsUrl, user.stripeCustomerId);

    this.loading.showLoaderUntilCompleted(updateCardSession$)
      .subscribe(session => {

        const stripe = Stripe(session.stripePublicKey, {stripeAccount: session.stripeTenantUserId});

        stripe.redirectToCheckout({
          sessionId: session.sessionId,
        });

      });

  }

  processCardUpdateCompletion(ongoingPurchaseSessionId:string) {

    console.log("Waiting for card update to complete ongoingPurchaseSessionId = ", ongoingPurchaseSessionId);

    this.purchases.waitForPurchaseCompletion(
      ongoingPurchaseSessionId,
      'Card successfully updated, please enjoy the courses!')
      .subscribe(purchaseSession => {

        this.store.dispatch(cardUpdated({user: {}}));

      });

  }

}
