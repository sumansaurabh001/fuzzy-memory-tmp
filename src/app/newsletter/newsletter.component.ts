import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NewsletterService} from '../services/newsletter.service';
import {LoadingService} from '../services/loading.service';
import {MessagesService} from '../services/messages.service';
import {AppState} from '../store';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {NewsletterFormContent} from '../models/tenant.model';
import {selectNewsletterContent} from '../store/selectors';

@Component({
  selector: 'newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss']
})
export class NewsletterComponent implements OnInit {

  @Output()
  emailAdded = new EventEmitter();

  form: FormGroup;

  newsletter$: Observable<NewsletterFormContent>;

  constructor(
    private fb: FormBuilder,
    private newsletter: NewsletterService,
    private loading: LoadingService,
    private messages: MessagesService,
    private store: Store<AppState>) {

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email] ],
    });

  }

  ngOnInit() {

    this.newsletter$ = this.store.pipe(select(selectNewsletterContent));

  }

  saveEmail() {

    const email = this.form.value.email;

    const addToNewsletter$ = this.newsletter.addToNewsletter(email);

    this.loading.showLoaderUntilCompleted(addToNewsletter$)
      .subscribe(
        () => {
          this.messages.info('Thank you for subscribing, please check your inbox now.');
          this.emailAdded.next();
        },
        err => {
          console.log("Error subscribing to newsletter", err);
          this.messages.error("Error subscribing to newsletter.");
        }
      );


  }


}
