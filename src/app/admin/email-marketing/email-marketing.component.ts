import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'email-marketing',
  templateUrl: './email-marketing.component.html',
  styleUrls: ['./email-marketing.component.scss']
})
export class EmailMarketingComponent implements OnInit {

  newsletterForm: FormGroup;

  integrationForm: FormGroup;

  constructor(private fb: FormBuilder) {

  }

  ngOnInit() {
    this.newsletterForm = this.fb.group({
      callToAction: ['', [Validators.required] ],
      infoNote: ['', [Validators.required] ],
      buttonText: ['', [Validators.required] ]
    });

    this.integrationForm = this.fb.group({
      emailProvider: ['', [Validators.required] ],
      apiKey: [''],
      groupId: ['']
    });
  }

  saveNewsletterSettings() {

  }

  downloadAllEmails() {

  }

  isMailerliteSelected() {
    return this.integrationForm.value && this.integrationForm.value.emailProvider == 'mailerlite';
  }

}
