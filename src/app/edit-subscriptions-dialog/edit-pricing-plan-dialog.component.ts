import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {MessagesService} from '../services/messages.service';
import {PricingPlan} from '../models/pricing-plan.model';

@Component({
  selector: 'edit-subscriptions-dialog',
  templateUrl: './edit-pricing-plan-dialog.component.html',
  styleUrls: ['./edit-pricing-plan-dialog.component.scss'],
  providers: [
    MessagesService
  ]
})
export class EditPricingPlanDialogComponent implements OnInit {

  dialogTitle:string;

  planForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditPricingPlanDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.dialogTitle = data.dialogTitle;

    const plan: PricingPlan = data.plan;


    this.planForm = this.fb.group({
      planDescription: [plan.description, Validators.required],
      planPrice: [plan.price / 100, Validators.required]
    });

  }

  ngOnInit() {

  }

  close() {

    this.dialogRef.close();

  }

}
