import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppState} from '../../store';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {NewsletterFormContent} from '../../models/tenant.model';
import {selectEmailProviderSettings, selectNewsletterContent} from '../../store/selectors';
import {
  activateEmailMarketingIntegration,
  emailProviderSettingsLoaded,
  loadEmailProviderSettings,
  saveNewsletterFormContent
} from '../../store/platform.actions';
import {filter} from 'rxjs/operators';
import {EmailProviderSettings} from '../../models/email-provider-settings.model';
import {NewsletterService} from '../../services/newsletter.service';
import {EmailGroup} from '../../models/email-group.model';
import {LoadingService} from '../../services/loading.service';


@Component({
  selector: 'email-marketing',
  templateUrl: './email-marketing.component.html',
  styleUrls: ['./email-marketing.component.scss']
})
export class EmailMarketingComponent implements OnInit {

  newsletterForm: FormGroup;

  integrationForm: FormGroup;

  newsletterContent$: Observable<NewsletterFormContent>;

  emailProviderSettings$: Observable<EmailProviderSettings>;

  integrationActive: boolean;

  emailGroupsLoaded = false;
  emailGroups: EmailGroup[];


  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private newsletter: NewsletterService,
    private loading: LoadingService) {

  }

  ngOnInit() {

    this.newsletterForm = this.fb.group({
      callToAction: ['', [Validators.required]],
      infoNote: ['']
    });

    this.integrationForm = this.fb.group({
      providerId: ['', Validators.required],
      apiKey: ['', Validators.required],
      groupId: ['', Validators.required]
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

    this.emailProviderSettings$ = this.store.pipe(select(selectEmailProviderSettings));

    this.emailProviderSettings$
      .pipe(
        filter(settings => !!settings)
      )
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

    const val = this.integrationForm.value;

    return val.providerId && this.integrationActive;
  }

  isReadyToActivate() {

    const val = this.integrationForm.value;

    return val.providerId && !this.integrationActive;
  }

  loadEmailGroups() {

    const val = this.integrationForm.value;

    const loadEmailGroups$ = this.newsletter.loadEmailGroups(val.providerId, val.apiKey);

    return this.loading.showLoaderUntilCompleted(loadEmailGroups$)
      .subscribe(
        emailGroups => {
          this.emailGroupsLoaded = true;
          this.emailGroups = emailGroups;
        });
  }

  activateIntegration() {

    const val = this.integrationForm.value;

    const emailGroup = this.emailGroups.find(group => group.groupId = val.groupId);

    const emailProviderSettings: EmailProviderSettings = {
      integrationActive: true,
      apiKey: val.apiKey,
      providerId: val.providerId,
      groupId: val.groupId,
      groupDescription: emailGroup.description
    };

    this.store.dispatch(activateEmailMarketingIntegration({emailProviderSettings}));

  }

  cancelIntegration() {

  }

}
