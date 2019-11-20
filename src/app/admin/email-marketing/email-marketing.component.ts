import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppState} from '../../store';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {NewsletterFormContent} from '../../models/tenant.model';
import {selectNewsletterContent} from '../../store/selectors';
import {saveNewsletterFormContent} from '../../store/platform.actions';
import {filter} from 'rxjs/operators';



@Component({
  selector: 'email-marketing',
  templateUrl: './email-marketing.component.html',
  styleUrls: ['./email-marketing.component.scss']
})
export class EmailMarketingComponent implements OnInit {

  newsletterForm: FormGroup;

  integrationForm: FormGroup;

  newsletterContent$: Observable<NewsletterFormContent>;


  constructor(
    private fb: FormBuilder,
    private store:Store<AppState>) {

  }

  ngOnInit() {

    this.newsletterForm = this.fb.group({
      callToAction: ['', [Validators.required] ],
      infoNote: ['']
    });

    this.integrationForm = this.fb.group({
      emailProvider: [''],
      apiKey: [''],
      groupId: ['']
    });

    this.newsletterContent$ = this.store.pipe(select(selectNewsletterContent));

    this.newsletterContent$
      .pipe(
        filter(newsletter => !!newsletter)
      )
      .subscribe(
        newsletter => this.newsletterForm.patchValue({
          callToAction: newsletter.callToAction,
          infoNote: newsletter.infoNote
        })
      );

  }

  saveNewsletterSettings() {

    const newsletter = this.newsletterForm.value;

    this.store.dispatch(saveNewsletterFormContent({newsletter}));

  }

  downloadAllEmails() {

  }

  isMailerliteSelected() {
    return this.integrationForm.value && this.integrationForm.value.emailProvider == 'mailerlite';
  }

}
