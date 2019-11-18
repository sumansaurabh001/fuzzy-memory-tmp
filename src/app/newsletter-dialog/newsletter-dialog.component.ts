import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NewsletterService} from '../services/newsletter.service';
import {LoadingService} from '../services/loading.service';


@Component({
  selector: 'newsletter-dialog',
  templateUrl: './newsletter-dialog.component.html',
  styleUrls: ['./newsletter-dialog.component.scss']
})
export class NewsletterDialogComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data,
    private dialogRef: MatDialogRef<NewsletterDialogComponent>,
    private newsletter: NewsletterService,
    private loading: LoadingService) {

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email] ],
    });

  }

  ngOnInit() {



  }

  close() {
    this.dialogRef.close();
  }

  saveEmail() {



  }


}
