import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'email-marketing',
  templateUrl: './email-marketing.component.html',
  styleUrls: ['./email-marketing.component.scss']
})
export class EmailMarketingComponent implements OnInit {

  form: FormGroup;

  constructor(private fb: FormBuilder) {

  }

  ngOnInit() {
    this.form = this.fb.group({
      callToAction: ['', [Validators.required] ],
      infoNote: ['', [Validators.required] ],
      buttonText: ['', [Validators.required] ]
    });
  }

  saveNewsletterSettings() {

  }

  downloadAllEmails() {

  }
}
