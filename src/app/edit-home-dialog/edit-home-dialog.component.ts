import {Component, Inject, OnInit} from '@angular/core';
import {MessagesService} from '../services/messages.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {defaultEditorConfig} from '../common/html-editor.config';

@Component({
  selector: 'edit-home-dialog',
  templateUrl: './edit-home-dialog.component.html',
  styleUrls: ['./edit-home-dialog.component.scss'],
  providers: [
    MessagesService
  ]
})
export class EditHomeDialogComponent implements OnInit {

  form: FormGroup;

  editorConfig = defaultEditorConfig;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditHomeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(60)]]
    });

    this.form.patchValue({title: data.pageTitle});

  }

  ngOnInit() {

  }

  close() {
    this.dialogRef.close();
  }

  onBannerSelected() {

  }

  onLogoSelected() {

  }

}
