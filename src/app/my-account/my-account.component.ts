import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {User} from '../models/user.model';
import {AppState} from '../store';
import {select, Store} from '@ngrx/store';
import {selectUser} from '../store/selectors';
import {planNames} from '../common/text';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {CancelSubscriptionDialogComponent} from '../cancel-subscription-dialog/cancel-subscription-dialog.component';


@Component({
  selector: 'my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {


  user$: Observable<User>;

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog) {
  }

  ngOnInit() {

    this.user$ = this.store.pipe(select(selectUser));

  }

  isSubscriptionActive(user: User) {
    return user && user.pricingPlan;
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
    return new Date(user.planValidUntil.toMillis());
  }

  cancelPlan() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.minWidth = '550px';

    this.dialog.open(CancelSubscriptionDialogComponent, dialogConfig);

  }

}
