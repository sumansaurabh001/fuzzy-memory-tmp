import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenavContent} from '@angular/material';
import {NavigationEnd, Router} from '@angular/router';
import {filter, tap} from 'rxjs/operators';
import {DomSanitizer} from '@angular/platform-browser';
import {select, Store} from '@ngrx/store';
import {AppState} from './store';
import {Observable} from 'rxjs';
import {platformState} from './store/selectors';
import {LoadingService} from './services/loading.service';
import {PlatformState} from './store/platform.reducer';

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

    this.settings$ = this.store
      .pipe(
        select(platformState),
        filter(platformSettings => !!platformSettings.primaryColor)
      );

  }


  scrollToTop() {

    const main = document.querySelector('mat-sidenav-content');

    if (main) {
      main.scrollTo(0,0);
    }
  }


  brandStyles(branding: PlatformState) {

    const RGB = branding.primaryColor;

    const sliderColor ='rgba('+parseInt(RGB.substring(1,3),16)+','+parseInt(RGB.substring(3,5),16)+','+parseInt(RGB.substring(5,7),16)+',0.5)';

    const test = `

      <style>

        .theme .mat-toolbar.mat-primary {
          background: ${branding.primaryColor};        
        }
        
        .theme .mat-raised-button.mat-primary:not([disabled]), 
        .theme .mat-fab.mat-primary:not([disabled]), 
        .theme .mat-mini-fab.mat-primary:not([disabled]) { 
          background-color: ${branding.primaryColor};
        }
        
        .theme .mat-slide-toggle.mat-primary.mat-checked:not(.mat-disabled) .mat-slide-toggle-bar {
          background-color: ${sliderColor};
        }
        
        .theme .mat-slide-toggle.mat-primary.mat-checked:not(.mat-disabled) .mat-slide-toggle-thumb {
          background-color: ${branding.primaryColor};          
        }
        
        .theme .mat-progress-spinner circle, .mat-spinner circle {
          stroke: ${branding.primaryColor};
        
        }
        
        .theme .mat-progress-bar-fill::after {
          background-color: ${branding.primaryColor};
        }

      </style>`;

      return this.sanitizer.bypassSecurityTrustHtml(test);

  }


}
