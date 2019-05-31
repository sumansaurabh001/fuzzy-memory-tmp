import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MessagesService} from '../services/messages.service';
import {LoadingService} from '../services/loading.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PaymentsService} from '../services/payments.service';
import {User} from '../models/user.model';
import {Store} from '@ngrx/store';
import {AppState} from '../store';
import {PlanCancelled} from '../store/user.actions';
import * as firebase from 'firebase/app';


@Component({
  selector: 'cancel-subscription-dialog',
  templateUrl: './cancel-subscription-dialog.component.html',
  styleUrls: ['./cancel-subscription-dialog.component.scss'],
  providers: [MessagesService]
})
export class CancelSubscriptionDialogComponent implements OnInit {

  form:FormGroup;

  user:User;

  constructor(
    private dialogRef: MatDialogRef<CancelSubscriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private messages: MessagesService,
    private loading: LoadingService,
    private fb: FormBuilder,
    private payments: PaymentsService,
    private store: Store<AppState>) {

    this.user = data.user;

    this.form = this.fb.group({
      reason: ['', [Validators.required, Validators.minLength(20)]]
    });

  }

  ngOnInit() {


  }

  cancelSubscription() {

    const reason = this.form.value.reason;

    const cancelPlan$ = this.payments.cancelPlan(this.user, reason);

    this.loading.showLoader(cancelPlan$)
      .subscribe(
        response => {
          this.store.dispatch(new PlanCancelled({planEndsAt: firebase.firestore.Timestamp.fromMillis(response.planEndsAt)}));
          this.dialogRef.close(response);
        },
        response => {
          console.log("Error cancelling plan:", response);
          this.messages.error('Could not cancel plan, please contact support.');
        }
      );
  }

  close() {
    this.dialogRef.close();
  }


}
