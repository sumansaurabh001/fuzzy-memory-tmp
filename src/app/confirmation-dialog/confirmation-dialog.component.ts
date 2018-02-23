import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent  {

  title = '';
  textWarning = '';
  confirmationCode = 'DELETE';

  constructor(
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) {title, textWarning, confirmationCode}) {

    this.title = title;
    this.textWarning = textWarning;
    this.confirmationCode = confirmationCode;

  }

  cancel() {
    this.dialogRef.close({confirmed:false});

  }

  confirm() {
    this.dialogRef.close({confirmed:true});
  }



}
