import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {MessagesService} from '../services/messages.service';
import {LoadingService} from '../services/loading.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PaymentsService} from '../services/payments.service';
import {Store} from '@ngrx/store';
import {AppState} from '../store';
import {FAQ} from '../models/content/faq.model';
import {defaultEditorConfig} from '../common/html-editor.config';

@Component({
  selector: 'edit-faq-dialog',
  templateUrl: './edit-faq-dialog.component.html',
  styleUrls: ['./edit-faq-dialog.component.scss']
})
export class EditFaqDialogComponent implements OnInit {

  dialogTitle:string;
  faq:FAQ;

  form:FormGroup;

  editorConfig = defaultEditorConfig;

  constructor(
    private dialogRef: MatDialogRef<EditFaqDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private fb: FormBuilder) {


    this.dialogTitle = data.dialogTitle;
    this.faq = data.faq;

    this.form = this.fb.group({
      question: ['', [Validators.required, Validators.minLength(20)]],
      answer: ['', [Validators.required, Validators.minLength(20)]],
    });

    if (this.faq) {
      this.form.patchValue(this.faq);
    }

  }

  ngOnInit() {

  }

  save() {

  }

  close() {
    this.dialogRef.close();
  }

}
