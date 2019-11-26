import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppState} from '../../store';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {NewsletterFormContent} from '../../models/tenant.model';
import {selectEmailProviderSettings, selectNewsletterContent, selectTotalEmailsCollected} from '../../store/selectors';
import {
  activateEmailMarketingIntegration, cancelEmailMarketingIntegration,
  emailProviderSettingsLoaded,
  loadEmailProviderSettings,
  saveNewsletterFormContent
} from '../../store/platform.actions';
import {filter, tap} from 'rxjs/operators';
import {EmailProviderSettings} from '../../models/email-provider-settings.model';
import {NewsletterService} from '../../services/newsletter.service';
import {EmailGroup} from '../../models/email-group.model';
import {LoadingService} from '../../services/loading.service';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {DangerDialogComponent} from '../../danger-dialog/danger-dialog.component';
import {courseUnpublished} from '../../store/course.actions';
import {MessagesService} from '../../services/messages.service';


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

  totalEmailsCollected$: Observable<number>;

  settings: EmailProviderSettings;

  emailGroupsLoaded = false;
  emailGroups: EmailGroup[];


  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private newsletter: NewsletterService,
    private dialog: MatDialog,
    private loading: LoadingService,
    private messages: MessagesService) {

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
      .subscribe(
        settings => {
          this.settings = settings;
          if (settings) {
            this.integrationForm.patchValue({
              providerId: settings.providerId,
              apiKey: settings.apiKey,
              groupId: settings.groupId
            });
          }
          else {
            this.integrationForm.reset();
          }
        }
      );

    this.totalEmailsCollected$ = this.store.pipe(select(selectTotalEmailsCollected));

  }

  saveNewsletterSettings() {

    const newsletter = this.newsletterForm.value;

    this.store.dispatch(saveNewsletterFormContent({newsletter}));

  }

  isMailerliteSelected() {
    return this.integrationForm.value && this.integrationForm.value.providerId == 'mailerlite';
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
      apiKey: val.apiKey,
      providerId: val.providerId,
      groupId: val.groupId,
      groupDescription: emailGroup.description
    };

    this.store.dispatch(activateEmailMarketingIntegration({emailProviderSettings}));

  }

  cancelIntegration() {

    const config = new MatDialogConfig();

    config.autoFocus = true;

    config.data = {
      title: "Cancel Email Marketing Integration",
      warningMessage: "Your email marketing provider won't receive new customer emails anymore.",
      confirmationCode: this.settings.providerId,
      buttonText: "CANCEL INTEGRATION"
    };

    const dialogRef = this.dialog.open(DangerDialogComponent, config);

    dialogRef.afterClosed()
      .pipe(
        filter(result => result && result.confirm),
        tap(() => {

          this.store.dispatch(cancelEmailMarketingIntegration());

          this.messages.info("The email marketing integration is now canceled.");

        })
      )
      .subscribe();

  }

  downloadAllEmails() {

  }

}
