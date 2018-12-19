import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store';
import {isLoggedIn, isLoggedOut, userPictureUrl} from '../store/selectors';
import {Logout} from '../store/auth.actions';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {LoadingService} from '../services/loading.service';
import {MessagesService} from '../services/messages.service';
import {environment} from '../../environments/environment';
import {TenantService} from '../services/tenant.service';
import {checkIfPlatformSite, checkIfSingleSignOnPage} from '../common/platform-utils';

@Component({
  selector: 'top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopMenuComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;
  pictureUrl$: Observable<string>;

  isPlatformSite:boolean;
  isSingleSignOnPage:boolean;

  constructor(
    private store: Store<AppState>,
    private afAuth: AngularFireAuth,
    private router: Router,
    private loading: LoadingService,
    private tenant: TenantService) {

    this.isPlatformSite = checkIfPlatformSite();
    this.isSingleSignOnPage = checkIfSingleSignOnPage();

  }

  ngOnInit() {

    this.isLoggedIn$ = this.store.pipe(select(isLoggedIn));

    this.isLoggedOut$ = this.store.pipe(select(isLoggedOut));

    this.pictureUrl$ = this.store.pipe(select(userPictureUrl));

  }

  login() {

    if (this.isPlatformSite) {
      this.router.navigateByUrl('/login');
    }
    // if on a tenant subdomain, or tenant custom website
    else {

      let loginUrl =  `${environment.authenticationUrl}?redirectUrl=${window.location.href}`;

      if (this.tenant.id) {
        loginUrl += `&tenantId=${this.tenant.id}`;
      }

      window.location.href = loginUrl;

    }

  }

  logout() {
    this.afAuth.auth.signOut();
    this.store.dispatch(new Logout());
    this.loading.loadingOn();

    const reloadUrl = `${window.location.protocol}//${window.location.host}/courses`;

    setTimeout(() => window.location.href = reloadUrl, 300)

  }

}
