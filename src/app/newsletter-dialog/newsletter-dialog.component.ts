import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NewsletterService} from '../services/newsletter.service';
import {LoadingService} from '../services/loading.service';
import {MessagesService} from '../services/messages.service';


@Component({
  selector: 'newsletter-dialog',
  templateUrl: './newsletter-dialog.component.html',
  styleUrls: ['./newsletter-dialog.component.scss'],
  providers: [
    LoadingService
  ]
})
export class NewsletterDialogComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data,
    private dialogRef: MatDialogRef<NewsletterDialogComponent>,
    private newsletter: NewsletterService,
    private loading: LoadingService,
    private messages: MessagesService) {

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

    const email = this.form.value.email;

    const addToNewsletter$ = this.newsletter.addToNewsletter(email);

    this.loading.showLoaderUntilCompleted(addToNewsletter$)
      .subscribe(
        () => {
          this.messages.info('Thank you for subscribing, please check your inbox now.');
          this.dialogRef.close();
        },
        err => {
          console.log("Error subscribing to newsletter", err);
          this.messages.error("Error subscribing to newsletter.");
        }
      );


  }


}
