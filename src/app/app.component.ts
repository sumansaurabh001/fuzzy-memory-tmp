import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenavContent} from '@angular/material';
import {NavigationEnd, Router} from '@angular/router';
import {filter, tap} from 'rxjs/operators';
import {DomSanitizer} from '@angular/platform-browser';
import {select, Store} from '@ngrx/store';
import {AppState} from './store';
import {Observable} from 'rxjs/Observable';
import {brandingState} from './store/selectors';
import {BrandingState} from './store/branding.reducer';
import {LoadingService} from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  branding$: Observable<BrandingState>;

  constructor(
    private router:Router,
    private sanitizer: DomSanitizer,
    private store: Store<AppState>,
    private loading: LoadingService) {

  }

  ngOnInit() {

    this.loading.showLoading();

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        tap(() => this.scrollToTop())
      )
      .subscribe();

    this.branding$ = this.store
      .pipe(
        select(brandingState),
        filter(branding => !!branding.primaryColor)
      );

  }


  scrollToTop() {

    const main = document.querySelector('mat-sidenav-content');

    if (main) {
      main.scrollTo(0,0);
    }
  }


  brandStyles(branding: BrandingState) {

    const test = `
      <style>

        .theme .mat-toolbar.mat-primary {
          background: ${branding.primaryColor};        
        }

      </style>`;

      return this.sanitizer.bypassSecurityTrustHtml(test);

  }


}
