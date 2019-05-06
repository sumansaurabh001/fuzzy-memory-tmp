import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {minimalEditorConfig} from '../common/html-editor.config';
import {MessagesService} from '../services/messages.service';
import {EmailService} from '../services/email.service';
import {LoadingService} from '../services/loading.service';
import {Email} from '../models/email.model';

@Component({
  selector: 'contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss']
})
export class ContactPageComponent implements OnInit {

  form: FormGroup;

  editorConfig = minimalEditorConfig;

  constructor(
    private fb: FormBuilder,
    private messages: MessagesService,
    private email: EmailService,
    private loading: LoadingService) {

    this.form = fb.group({
      from: ['', Validators.required],
      subject: ['', Validators.required],
      html: ['', Validators.required]
    });

  }

  ngOnInit() {

  }

  sendEmail() {

    const val = this.form.value as Email;

    if (!this.form.valid) {
      this.messages.error("Please fill in a valid email, subject and the message.")
    }

    const sendEmail$ = this.email.sendEmail(val);

    this.loading.showLoaderUntilCompleted(sendEmail$)
      .subscribe(
        () => {
          this.messages.info('Message sent successfully.');
          this.form.reset();
        },
        err => {
          console.log("Could not send email, reason:", err);
          this.messages.error("Could not sent message, please try again in a few minutes.");
        }
      );

  }

}
