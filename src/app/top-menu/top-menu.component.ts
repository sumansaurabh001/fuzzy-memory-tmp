import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable, combineLatest} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store';
import {arePricingPlansReady, isLoggedIn, isLoggedOut,  selectUser, userPictureUrl} from '../store/selectors';
import {logout} from '../store/user.actions';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {LoadingService} from '../services/loading.service';
import {MessagesService} from '../services/messages.service';
import {environment} from '../../environments/environment';
import {TenantService} from '../services/tenant.service';
import {checkIfPlatformSite, checkIfSingleSignOnPage} from '../common/platform-utils';
import {map, tap, withLatestFrom} from 'rxjs/operators';
import {User} from '../models/user.model';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {NewsletterDialogComponent} from '../newsletter-dialog/newsletter-dialog.component';



@Component({
  selector: 'top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;
  pictureUrl$: Observable<string>;
  arePricingPlansReady$: Observable<boolean>;
  user$ : Observable<User>;
  showSubscription$ : Observable<boolean>;

  isPlatformSite:boolean;
  isSingleSignOnPage:boolean;

  constructor(
    private store: Store<AppState>,
    private afAuth: AngularFireAuth,
    private router: Router,
    private loading: LoadingService,
    private tenant: TenantService,
    private dialog: MatDialog) {

    this.isPlatformSite = checkIfPlatformSite();
    this.isSingleSignOnPage = checkIfSingleSignOnPage();

  }

  ngOnInit() {

    this.isLoggedIn$ = this.store.pipe(select(isLoggedIn));

    this.isLoggedOut$ = this.store.pipe(select(isLoggedOut));

    this.pictureUrl$ = this.store.pipe(select(userPictureUrl));

    this.arePricingPlansReady$ = this.store.pipe(select(arePricingPlansReady));

    this.user$ = this.store
      .pipe(
        select(selectUser),
      );

    this.showSubscription$ =
      combineLatest(this.tenant.tenantId$, this.user$, this.arePricingPlansReady$)
      .pipe(
        map(([tenantId, user, arePricingPlansReady]) => arePricingPlansReady || (user? user.id == tenantId : false) )
      );

  }

  login() {

    if (this.isPlatformSite) {
      this.router.navigateByUrl('/login');
    }
    // if on a tenant subdomain, or tenant custom website
    else {

      const encodedRedirectUrl = encodeURIComponent(window.location.href);

      let loginUrl =  `${environment.authenticationUrl}?redirectUrl=${encodedRedirectUrl}`;

      if (this.tenant.id) {
        loginUrl += `&tenantId=${this.tenant.id}`;
      }

      window.location.href = loginUrl;

    }

  }

  logout() {

    this.afAuth.auth.signOut()
      .then(() => {

        this.loading.loadingOn();

        this.login();

      });

  }

  showNewsletterPopup() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.width = '710px';

    this.dialog.open(NewsletterDialogComponent, dialogConfig);

  }


}
