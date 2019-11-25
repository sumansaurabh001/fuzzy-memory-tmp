import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppState} from '../../store';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {NewsletterFormContent} from '../../models/tenant.model';
import {selectEmailProviderSettings, selectNewsletterContent} from '../../store/selectors';
import {emailProviderSettingsLoaded, loadEmailProviderSettings, saveNewsletterFormContent} from '../../store/platform.actions';
import {filter} from 'rxjs/operators';
import {EmailProviderSettings} from '../../models/email-provider-settings.model';



@Component({
  selector: 'email-marketing',
  templateUrl: './email-marketing.component.html',
  styleUrls: ['./email-marketing.component.scss']
})
export class EmailMarketingComponent implements OnInit {

  newsletterForm: FormGroup;

  integrationForm: FormGroup;

  newsletterContent$: Observable<NewsletterFormContent>;

  emaiProviderSettings$ : Observable<EmailProviderSettings>;

  integrationActive: boolean;


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
      providerId: ['', Validators.required],
      apiKey: ['',  Validators.required],
      groupId: ['',  Validators.required]
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

    this.store.dispatch(loadEmailProviderSettings());

    this.emaiProviderSettings$ = this.store.pipe(select(selectEmailProviderSettings));

    this.emaiProviderSettings$
      .subscribe(
        settings => {
          this.integrationForm.patchValue({
            providerId: settings.providerId,
            apiKey: settings.apiKey,
            groupId: settings.groupId
          });
          this.integrationActive = settings.integrationActive;
        }
      );

  }

  saveNewsletterSettings() {

    const newsletter = this.newsletterForm.value;

    this.store.dispatch(saveNewsletterFormContent({newsletter}));

  }

  downloadAllEmails() {

  }

  isMailerliteSelected() {
    return this.integrationForm.value && this.integrationForm.value.providerId == 'mailerlite';
  }

  isIntegrationActive() {
    const val =  this.integrationForm.value;

    return val.providerId && this.integrationActive;
  }

  isReadyToActivate() {
    const val =  this.integrationForm.value;

    return val.providerId && !this.integrationActive;
  }
}
