import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MessagesService} from '../services/messages.service';
import {PricingPlan} from '../models/pricing-plan.model';
import {PricingPlansService} from '../services/pricing-plans.service';
import {noop, Observable} from 'rxjs';
import {LoadingService} from '../services/loading.service';
import {AppState} from '../store';
import {Store} from '@ngrx/store';
import {updatePricingPlan} from '../store/pricing-plans.actions';
import {concatMap} from 'rxjs/operators';
import {PricingPlansState} from '../store/pricing-plans.reducer';
const arrayMove = require('array-move');

@Component({
  selector: 'edit-subscriptions-dialog',
  templateUrl: './edit-pricing-plan-dialog.component.html',
  styleUrls: ['./edit-pricing-plan-dialog.component.scss'],
  providers: [
    MessagesService
  ]
})
export class EditPricingPlanDialogComponent implements OnInit {

  dialogTitle: string;

  editPlanName: boolean;

  editUndiscountedPrice: boolean;

  updateStripePlan = true;

  pricingPlan: PricingPlan;

  planForm: FormGroup;

  allPlans: PricingPlansState;

  planName:string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditPricingPlanDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private pricingPlans: PricingPlansService,
    private messages: MessagesService,
    private loading: LoadingService,
    private store: Store<AppState>) {

    this.dialogTitle = data.dialogTitle;
    this.editPlanName = data.editPlanName;
    this.editUndiscountedPrice = data.editUndiscountedPrice;
    this.updateStripePlan = data.updateStripePlan;

    this.allPlans = data.allPlans;
    this.planName = data.planName;

    const editedPlan:PricingPlan = this.allPlans[this.planName];

    this.pricingPlan = {
      ...editedPlan,
      features: editedPlan.features.slice(0)
    };

    this.planForm = this.fb.group({
      planDescription: [this.pricingPlan.description, Validators.required],
      planPrice: [this.pricingPlan.price / 100, Validators.required],
      undiscountedPrice: [this.pricingPlan.undiscountedPrice / 100, Validators.required]
    });

  }

  ngOnInit() {

  }



  save() {

    const val = this.planForm.value;

    this.pricingPlan.price = val.planPrice * 100;
    this.pricingPlan.undiscountedPrice = val.undiscountedPrice * 100;
    this.pricingPlan.description = val.planDescription;


    const newPlans = {
      ...this.allPlans
    };

    newPlans[this.planName] = this.pricingPlan;

    let saveCourse$ = this.pricingPlans.updatePlans(newPlans);

    // only these two fields affect the Stripe pricing plan
    if (this.updateStripePlan && (this.planForm.controls['planDescription'].dirty || this.planForm.controls['planPrice'].dirty)) {

      console.log('Updating Stripe pricing plan ...');

      const updatePlan$ = this.pricingPlans.updateStripePricingPlan(
        this.planName,
        {
          description: this.pricingPlan.description,
          price: this.pricingPlan.price,
          frequency: this.pricingPlan.frequency
        });

      saveCourse$ = saveCourse$.pipe(concatMap(() => updatePlan$));
    }

    this.loading.showLoader(saveCourse$)
      .subscribe(
        () => {

          this.store.dispatch(updatePricingPlan({planName: this.planName, changes: this.pricingPlan}));

          this.dialogRef.close(this.pricingPlan);

        },
        err => {
          this.messages.error('Error saving pricing plan:' + err);
          console.error('Error saving pricing plan:', err);
        }
      );

  }

  onAddFeature(newFeature:string) {
    const newFeatures = this.pricingPlan.features.slice(0);
    newFeatures.push(newFeature);
    this.pricingPlan.features = newFeatures;
  }

  onDeleteFeature(index:number) {
    const newFeatures = [...this.pricingPlan.features];
    newFeatures.splice(index, 1);
    this.pricingPlan.features = newFeatures;
  }

  onFeaturesOrderChanged(features:string[]) {
    this.pricingPlan.features = features;
  }

  close() {

    this.dialogRef.close();

  }

}
