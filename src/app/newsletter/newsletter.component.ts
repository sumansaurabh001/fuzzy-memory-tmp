import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NewsletterService} from '../services/newsletter.service';
import {LoadingService} from '../services/loading.service';
import {MessagesService} from '../services/messages.service';

@Component({
  selector: 'newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss']
})
export class NewsletterComponent implements OnInit {

  @Output()
  emailAdded = new EventEmitter();

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private newsletter: NewsletterService,
    private loading: LoadingService,
    private messages: MessagesService) {

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email] ],
    });

  }

  ngOnInit() {


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
