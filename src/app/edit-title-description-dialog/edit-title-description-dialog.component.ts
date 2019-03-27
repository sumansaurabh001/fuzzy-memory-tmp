import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {MessagesService} from '../services/messages.service';
import {LoadingService} from '../services/loading.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PaymentsService} from '../services/payments.service';
import {Store} from '@ngrx/store';
import {AppState} from '../store';
import {defaultEditorConfig} from '../common/html-editor.config';

@Component({
  selector: 'edit-title-description-dialog',
  templateUrl: './edit-title-description-dialog.component.html',
  styleUrls: ['./edit-title-description-dialog.component.scss']
})
export class EditTitleDescriptionDialogComponent implements OnInit {

  dialogTitle:string;
  title:string;
  description:string;

  form:FormGroup;

  editorConfig = defaultEditorConfig;

  constructor(
    private dialogRef: MatDialogRef<EditTitleDescriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private fb: FormBuilder) {

    this.dialogTitle = data.dialogTitle;
    this.title = data.title;
    this.description = data.description;

    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.required]],
      description: ['', [Validators.required, Validators.required]],
    });

    if (this.title) {
      this.form.patchValue({
        title: this.title,
        description: this.description
      });
    }

  }

  ngOnInit() {

  }

  save() {

    const val = this.form.value;

    this.dialogRef.close({
      title: val.title,
      description: val.description
    });

  }

  close() {
    this.dialogRef.close();
  }

}
