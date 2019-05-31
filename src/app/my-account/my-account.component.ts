import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {User} from '../models/user.model';
import {AppState} from '../store';
import {select, Store} from '@ngrx/store';
import {selectUser} from '../store/selectors';
import {planNames} from '../common/text';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {CancelSubscriptionDialogComponent} from '../cancel-subscription-dialog/cancel-subscription-dialog.component';

import * as dayjs from 'dayjs';
import {MessagesService} from '../services/messages.service';
import {setSchoolNameAsPageTitle} from '../common/seo-utils';
import {Title} from '@angular/platform-browser';


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
    private title: Title) {
  }

  ngOnInit() {

    this.user$ = this.store.pipe(select(selectUser));

    setSchoolNameAsPageTitle(this.store, this.title);

  }

  isSubscriptionActive(user: User) {
    return user && user.pricingPlan && (!user.planEndsAt || dayjs(user.planEndsAt.toMillis()).isAfter(dayjs()));
  }

  isSubscriptionCancelled(user: User) {
    return user && user.planEndsAt;
  }



  subscriptionDescr(user: User) {
    return user.pricingPlan ? planNames[user.pricingPlan] : 'None';
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

}
