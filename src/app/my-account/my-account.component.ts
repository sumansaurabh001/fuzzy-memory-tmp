import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {User} from '../models/user.model';
import {AppState} from '../store';
import {select, Store} from '@ngrx/store';
import {selectUser} from '../store/selectors';
import {planNames} from '../common/text';


@Component({
  selector: 'my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {


  user$: Observable<User>;

  constructor(private store: Store<AppState>) {
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

  }

}
