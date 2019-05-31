import {Component, HostListener, Inject, OnDestroy, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import {LoadingService} from '../services/loading.service';
import {TenantsDBService} from '../services/tenants-db.service';
import {AppState} from '../store';
import {Store} from '@ngrx/store';
import {Login} from '../store/user.actions';
import {ActivatedRoute, Router} from '@angular/router';
import {checkIfPlatformSite, DEFAULT_THEME} from '../common/platform-utils';
import {ONLINECOURSEHOST_ACCENT_COLOR, ONLINECOURSEHOST_PRIMARY_COLOR} from '../common/ui-constants';
import {ThemeChanged} from '../store/platform.actions';
import {CustomJwtAuthService} from '../services/custom-jwt-auth.service';
import {concatMap, filter, first, map, tap, withLatestFrom} from 'rxjs/operators';
import {SchoolUsersDbService} from '../services/school-users-db.service';
import {Tenant} from '../models/tenant.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {AskSchoolDetailsDialogComponent} from '../ask-school-details-dialog/ask-school-details-dialog.component';
import {Title} from '@angular/platform-browser';


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  ui: firebaseui.auth.AuthUI;

  isPlatformSite: boolean;
  isEmailAndPassword: boolean;
  redirectUrl: string;
  tenantId: string;

  initializeTenantOngoing = false;


  constructor(
    public afAuth: AngularFireAuth,
    private tenantsDB: TenantsDBService,
    private loading: LoadingService,
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private jwtService: CustomJwtAuthService,
    private usersDB: SchoolUsersDbService,
    private dialog: MatDialog,
    private title:Title) {

    this.isPlatformSite = checkIfPlatformSite();

    this.isEmailAndPassword = !!route.snapshot.queryParamMap.get('mode');
    this.redirectUrl = route.snapshot.queryParamMap.get('redirectUrl');
    this.tenantId = route.snapshot.queryParamMap.get('tenantId');

  }

  ngOnInit() {

    this.title.setTitle("Login");

    this.loading.loadingOn();

    // if logging in to the platform website, apply the platform brand
    if (this.isPlatformSite) {
      this.store.dispatch(new ThemeChanged(DEFAULT_THEME));
    }

    try {

      const uiConfig = {

        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.FacebookAuthProvider.PROVIDER_ID,
          firebase.auth.TwitterAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        callbacks: {
          signInSuccessWithAuthResult: this.onLoginSuccessful.bind(this),
          uiShown: () => {
            this.loading.loadingOff();
          }
        }
      };

      this.ui = new firebaseui.auth.AuthUI(this.afAuth.auth);

      // The start method will wait until the DOM is loaded.
      this.ui.start('#firebaseui-auth-container', uiConfig);

    }
    catch (err) {
      this.loading.loadingOff();
    }

  }

  onLoginSuccessful(result) {

    const email = result.user.email,
      displayName = result.user.displayName;

    let picture;

    if (result.additionalUserInfo && result.additionalUserInfo.profile) {
      picture = result.additionalUserInfo.profile.picture;
    }

    if (this.isPlatformSite) {
      this.handlePlatformWebsiteLogin(email, picture);
    }
    else if (this.redirectUrl) {
      this.handleTenantWebsiteLogin(email, picture);
    }

    return false;
  }

  /*
  *
  * The user has logged in to the app.onlinecoursehost.com domain.
  *
  * This means this user is an administrator of a given online school,
  * and has his own subdomain (e.g. online-school-5000.onlinecoursehost.com).
  *
  * We need to first register this user as a tenant in the database if necessary.
  *
  * Then, we need to create a custom JWT token to authenticate the user in his subdomain.
  *
  * We then redirect the user to his subdomain, sending the jwt as a url parameter.
  *
  * All course editing etc. happens directly in his subdomain, and not on app.onlinecoursehost.com.
  *
  * */

  handlePlatformWebsiteLogin(email: string, pictureUrl:string) {

    console.log("calling handlePlatformWebsiteLogin()");

    this.loading.showLoader(
      this.tenantsDB.createTenantIfNeeded(email, pictureUrl)
        .pipe(
            withLatestFrom(this.afAuth.idToken),
            tap(console.log),
            concatMap(([tenant, authJwtToken]) =>
              this.jwtService.createCustomJwt(tenant.id, tenant.id, authJwtToken)
                .pipe(
                  tap(jwt => this.redirectTenantToSubdomain(jwt, tenant))
                )


            ),

        )
    )
      .subscribe();
  }

  /**
   *
   * The user has logged in to a tenant website in the single sign-on page login.onlinecoursehost.com
   *
   * create a custom JWT token and send the it back to the tenant website using the redirect Url.
   *
   * The user will be redirected to the tenant domain which will either be a hosting sub-domain online-school-5000.onlinecoursehost.com,
   * or a custom domain like chess-classes.com.
   *
   * On arrival the user will be authenticated using the custom JWT.
   *
   */

  handleTenantWebsiteLogin(email: string, pictureUrl:string) {
    this.loading.showLoader(
      this.afAuth.authState
        .pipe(
          filter(authState => !!authState.uid),
          concatMap(authState =>
            this.usersDB.saveLatestUserProfile(authState.uid, this.tenantId, email, pictureUrl)
              .pipe(
                map(() => authState.uid)
              )
          ),
          withLatestFrom(this.afAuth.idToken),
          concatMap(([uid, authJwtToken]) => this.jwtService.createCustomJwt(this.tenantId, uid, authJwtToken)),
          filter(jwt => !!jwt),
          tap(jwt => this.redirectUsingRedirectUrl(jwt))
        )
    )
      .subscribe();

  }

  redirectTenantToSubdomain(jwt:string, tenant: Tenant) {

    console.log("custom jwt:", jwt);


    // if it's the first time the tenant is logging in, then setup the tenant subdomain first
    if (!tenant.subDomain && !this.initializeTenantOngoing) {

      this.initializeTenantOngoing = true;

      const dialogConfig = new MatDialogConfig();

      dialogConfig.autoFocus = true;
      dialogConfig.disableClose = true;
      dialogConfig.minWidth = '750px';

      const dialogRef = this.dialog.open(AskSchoolDetailsDialogComponent, dialogConfig);

      dialogRef.afterClosed()
        .pipe(
          concatMap(({subDomain, schoolName}) => this.loading.showLoader(this.tenantsDB.updateTenant(tenant.id, {subDomain, schoolName}))
                                                                .pipe(map(() => subDomain))),
          tap(subDomain => this.signInToTenantSubdomain(subDomain, jwt))
        )
        .subscribe();
    }
    else if (tenant.subDomain) {
      this.signInToTenantSubdomain(tenant.subDomain, jwt)
    }

  }

  signInToTenantSubdomain(subDomain:string, jwt:string) {

    const urlSubdomains = window.location.hostname.split('.'),
      topLevelSubdomain = urlSubdomains[urlSubdomains.length - 1],
      port = window.location.port,
      protocol = window.location.protocol;

    // building a url that looks like http://angular-university.onlinecoursehost.test:4201/courses?authJwtToken=...

    let redirectUrlWithAuthToken = `${protocol}//${subDomain}.onlinecoursehost.${topLevelSubdomain}`;

    if (port) {
      redirectUrlWithAuthToken += `:${port}`;
    }

    redirectUrlWithAuthToken += `/courses?authJwtToken=${jwt}`;

    console.log("Redirecting to ", redirectUrlWithAuthToken);

    window.location.href = redirectUrlWithAuthToken;

  }



  redirectUsingRedirectUrl(jwt) {

    console.log("custom jwt:", jwt);

    let redirectUrlWithAuthToken = `${this.redirectUrl}`;

    redirectUrlWithAuthToken += this.redirectUrl.includes('?') ? '&' : '?';

    redirectUrlWithAuthToken += `authJwtToken=${jwt}`;

    console.log("Redirecting to ", redirectUrlWithAuthToken);

    window.location.href = redirectUrlWithAuthToken;
  }

  ngOnDestroy() {
    this.ui.delete();
  }

  @HostListener('window:unload', [ '$event' ])
  unloadHandler(event) {
    if (this.isPlatformSite) {
      // always logout from the domain app.onlinecoursehost.com on page exit (back button, browser close, etc.), as we won't be needing this JWT anymore
      this.afAuth.auth.signOut();
    }

  }


}
