import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';


@Component({
  selector: 'confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {

  title:string;
  confirmationText:string;

  constructor(
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data ) {

    this.title = data.title;
    this.confirmationText = data.confirmationText;

  }

  cancel() {
    this.dialogRef.close({confirm:false});
  }

  confirm() {
    this.dialogRef.close({confirm:true});
  }

}
