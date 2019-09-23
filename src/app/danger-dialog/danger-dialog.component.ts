import {ChangeDetectionStrategy, Component, Inject, Input, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MessagesService} from '../services/messages.service';

@Component({
  selector: 'danger-dialog',
  templateUrl: './danger-dialog.component.html',
  styleUrls: ['./danger-dialog.component.scss'],
  providers: [
    MessagesService
  ]
})
export class DangerDialogComponent  {

  title = '';
  warningMessage:string;
  confirmationCode = 'DELETE';
  buttonText:string;

  constructor(
    private dialogRef: MatDialogRef<DangerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) {title, confirmationCode, warningMessage, buttonText},
    private messages: MessagesService) {

    this.title = title;
    this.warningMessage = warningMessage ? warningMessage : "This operation cannot be reversed.";
    this.confirmationCode = confirmationCode;
    this.buttonText = buttonText ? buttonText : "CONFIRM"

  }

  cancel() {
    this.dialogRef.close();

  }

  confirm(userCode) {
    if (userCode == this.confirmationCode) {
      this.dialogRef.close({confirm:true});
    }
    else {
      this.messages.error("Invalid confirmation code.");
    }

  }



}
