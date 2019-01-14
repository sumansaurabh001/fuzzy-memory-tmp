import {ChangeDetectionStrategy, Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
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
  confirmationCode = 'DELETE';

  constructor(
    private dialogRef: MatDialogRef<DangerDialogComponent>,
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
