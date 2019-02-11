import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {MessagesService} from '../services/messages.service';
import {PricingPlan} from '../models/pricing-plan.model';
import {PricingPlansService} from '../services/pricing-plans.service';
import {noop} from 'rxjs';
import {LoadingService} from '../services/loading.service';
import {AppState} from '../store';
import {Store} from '@ngrx/store';
import {UpdatePricingPlan} from '../store/pricing-plans.actions';

@Component({
  selector: 'edit-subscriptions-dialog',
  templateUrl: './edit-monthly-pricing-plan-dialog.component.html',
  styleUrls: ['./edit-monthly-pricing-plan-dialog.component.scss'],
  providers: [
    MessagesService
  ]
})
export class EditMonthlyPricingPlanDialogComponent implements OnInit {

  dialogTitle: string;

  planForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditMonthlyPricingPlanDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private pricingPlans: PricingPlansService,
    private messages: MessagesService,
    private loading: LoadingService,
    private store: Store<AppState>) {

    this.dialogTitle = data.dialogTitle;

    const plan: PricingPlan = data.plan;


    this.planForm = this.fb.group({
      planDescription: [plan.description, Validators.required],
      planPrice: [plan.price / 100, Validators.required]
    });

  }

  ngOnInit() {

  }


  save() {

    const val = this.planForm.value;

    const saveCourse$ = this.pricingPlans.savePricingPlan(
      'monthlyPlan',
      {
        description: val.planDescription,
        price: val.planPrice,
        frequency: 'month'
      });

    this.loading.showLoader(saveCourse$)
      .subscribe(
        changes => {

          this.store.dispatch(new UpdatePricingPlan({planName: 'monthlyPlan', changes}));

          this.close();

        },
        err => {
          this.messages.error('Error saving monthly pricing plan:' + err);
          console.error('Error saving monthly pricing plan:', err);
        }
      );

  }


  close() {

    this.dialogRef.close();

  }

}
