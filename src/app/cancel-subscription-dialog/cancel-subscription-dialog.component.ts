import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {MessagesService} from '../services/messages.service';
import {LoadingService} from '../services/loading.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'cancel-subscription-dialog',
  templateUrl: './cancel-subscription-dialog.component.html',
  styleUrls: ['./cancel-subscription-dialog.component.scss']
})
export class CancelSubscriptionDialogComponent implements OnInit {

  form:FormGroup;

  constructor(
    private dialogRef: MatDialogRef<CancelSubscriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private messages: MessagesService,
    private loading: LoadingService,
    private fb: FormBuilder) {

    this.form = this.fb.group({
      reason: ['', [Validators.required, Validators.minLength(20)]]
    });

  }

  ngOnInit() {

  }

  cancelSubscription() {

  }

  close() {
    this.dialogRef.close();
  }


}
