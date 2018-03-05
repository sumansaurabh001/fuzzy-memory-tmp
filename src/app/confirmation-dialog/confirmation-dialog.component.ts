import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {MessagesService} from '../services/messages.service';

@Component({
  selector: 'confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
  providers: [
    MessagesService
  ]
})
export class ConfirmationDialogComponent  {

  title = '';
  confirmationCode = 'DELETE';

  constructor(
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) {title, confirmationCode},
    private messages: MessagesService) {

    this.title = title;
    this.confirmationCode = confirmationCode;

  }

  cancel() {
    this.dialogRef.close();

  }

  confirm(userCode) {
    if (userCode == this.confirmationCode) {
      this.dialogRef.close(true);
    }
    else {
      this.messages.error("Invalid confirmation code.");
    }

  }



}
