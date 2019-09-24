import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import { MatSidenavContent } from '@angular/material/sidenav';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, tap} from 'rxjs/operators';
import {DomSanitizer} from '@angular/platform-browser';
import {select, Store} from '@ngrx/store';
import {AppState} from './store';
import {Observable} from 'rxjs';
import {platformState} from './store/selectors';
import {LoadingService} from './services/loading.service';
import {PlatformState} from './store/platform.reducer';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  settings$: Observable<PlatformState>;

  constructor(
    private router:Router,
    private sanitizer: DomSanitizer,
    private store: Store<AppState>,
    private loading: LoadingService,
    private route: ActivatedRoute,
    private afAuth: AngularFireAuth) {

  }

  ngOnInit() {

    this.loading.showLoading();

    // scroll to the top of the page after every router navigation
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        tap(() => this.scrollToTop())
      )
      .subscribe();

    this.settings$ = this.store
      .pipe(
        select(platformState),
        filter(platformSettings => platformSettings.brandTheme && !!platformSettings.brandTheme.primaryColor)
      );

    this.route.queryParamMap
      .subscribe(params => {

        const authJwtToken = params.get('authJwtToken');

        // clear the JWT from the url, to make sure the token is never accidentally reused
        if (authJwtToken) {
          window.history.replaceState(null, null, window.location.pathname);
        }

      });

  }


  scrollToTop() {

    const main = document.querySelector('mat-sidenav-content');

    if (main) {
      main.scrollTo(0,0);
    }

  }

  /**
   *
   * This style tag gets injected in the page, and it will overwrite the default theme with the tenant brand colors.
   *
   */

  brandStyles(branding: PlatformState) {

    const primaryColor = branding.brandTheme.primaryColor,
          accentColor = branding.brandTheme.accentColor;

    const sliderColor ='rgba('+parseInt(
      primaryColor.substring(1,3),16)+','+parseInt(primaryColor.substring(3,5),16)+','+parseInt(primaryColor.substring(5,7),16)+',0.5)';

    const test = `

      <style>

        .theme .mat-toolbar.mat-primary {
          background: ${primaryColor};        
        }
        
        .theme .mat-raised-button.mat-primary:not([disabled]), 
        .theme .mat-fab.mat-primary:not([disabled]), 
        .theme .mat-mini-fab.mat-primary:not([disabled]) { 
          background-color: ${primaryColor};
        }
        
        .mat-flat-button.mat-accent, .mat-raised-button.mat-accent, .mat-fab.mat-accent, .mat-mini-fab.mat-accent {
          background-color: ${accentColor}; 
        }        
        
        .theme .mat-slide-toggle.mat-primary.mat-checked:not(.mat-disabled) .mat-slide-toggle-bar {
          background-color: ${sliderColor};
        }
        
        .theme .mat-slide-toggle.mat-primary.mat-checked:not(.mat-disabled) .mat-slide-toggle-thumb {
          background-color: ${primaryColor};          
        }
        
        .theme .mat-progress-spinner circle, .mat-spinner circle {
          stroke: ${primaryColor};
        
        }
        
        .theme .mat-progress-bar-fill::after {
          background-color: ${primaryColor};
        }
        
        .theme .mat-button.mat-primary, .theme .mat-icon-button.mat-primary, .theme .mat-stroked-button.mat-primary {
          color: ${primaryColor};
        }

      </style>`;

      return this.sanitizer.bypassSecurityTrustHtml(test);

  }


}
