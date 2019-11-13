import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MessagesService} from '../services/messages.service';
import {LoadingService} from '../services/loading.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PaymentsService} from '../services/payments.service';
import {Store} from '@ngrx/store';
import {AppState} from '../store';
import {defaultEditorConfig} from '../common/html-editor.config';
import {QuillConfig, QuillToolbarConfig} from 'ngx-quill';

import 'quill-emoji/dist/quill-emoji.js';

@Component({
  selector: 'edit-title-description-dialog',
  templateUrl: './edit-title-description-dialog.component.html',
  styleUrls: ['./edit-title-description-dialog.component.scss']
})
export class EditTitleDescriptionDialogComponent implements OnInit {

  dialogTitle: string;
  title: string;
  description: string;
  showTitle: boolean;
  titlePlaceHolder: string;
  descriptionPlaceholder: string;

  form: FormGroup;

  editorConfig: any;


  constructor(
    private dialogRef: MatDialogRef<EditTitleDescriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private fb: FormBuilder) {

    this.dialogTitle = data.dialogTitle;
    this.title = data.title;
    this.description = data.description;

    this.editorConfig = data.editorConfig ? data.editorConfig : defaultEditorConfig();

    this.showTitle = data.hasOwnProperty("showTitle") ? !!data.showTitle : true;

    this.titlePlaceHolder = data.titlePlaceHolder ? data.titlePlaceHolder : 'Type here the title...';

    this.descriptionPlaceholder = data.descriptionPlaceholder ? data.descriptionPlaceholder : 'Type here the description...';

    const formConfig = {
      description: ['', [Validators.required, Validators.required]],
    };

    if (this.showTitle) {
      formConfig['title'] = ['', [Validators.required, Validators.required]];
    }

    this.form = this.fb.group(formConfig);

    if (this.title || this.description) {
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

    let descriptionText:string = val.description;

    descriptionText = descriptionText.replace(new RegExp("<p><br></p><pre", 'g'), "<pre");

    this.dialogRef.close({
      title: val.title,
      description: descriptionText
    });

  }

  close() {
    this.dialogRef.close();
  }


  setFocus(editor: any) {
    editor.focus();
  }

}
