import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import {LoadingService} from '../services/loading.service';
import {TenantsDBService} from '../services/tenants-db.service';
import {AppState} from '../store';
import {Store} from '@ngrx/store';
import {Login} from '../store/auth.actions';
import {ActivatedRoute, Router} from '@angular/router';
import {checkIfPlatformSite, ONLINECOURSEHOST_THEME} from '../common/platform-utils';
import {ONLINECOURSEHOST_ACCENT_COLOR, ONLINECOURSEHOST_PRIMARY_COLOR} from '../common/ui-constants';
import {ThemeChanged} from '../store/platform.actions';
import {CustomJwtAuthService} from '../services/custom-jwt-auth.service';
import {concatMap, filter, map} from 'rxjs/operators';
import {SchoolUsersDbService} from '../services/school-users-db.service';


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
  tenantId:string;



  constructor(
    public afAuth: AngularFireAuth,
    private tenantsDB: TenantsDBService,
    private loading: LoadingService,
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private jwtService: CustomJwtAuthService,
    private usersDB: SchoolUsersDbService) {

    this.isPlatformSite = checkIfPlatformSite();

    this.isEmailAndPassword = !!route.snapshot.queryParamMap.get('mode');
    this.redirectUrl = route.snapshot.queryParamMap.get('redirectUrl');
    this.tenantId = route.snapshot.queryParamMap.get('tenantId');

  }

  ngOnInit() {

    this.loading.loadingOn();

    // if logging in to the platform website, apply the platform brand
    if (this.isPlatformSite) {
      this.store.dispatch(new ThemeChanged(ONLINECOURSEHOST_THEME));
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
      this.handlePlatformWebsiteLogin(email, picture, displayName);
    }
    else if (this.redirectUrl) {
      this.handleTenantWebsiteLogin(email, picture, displayName);
    }

    return false;
  }

  handlePlatformWebsiteLogin(email:string, picture:string, displayName:string) {
    this.loading.showLoader(
      this.tenantsDB.createTenantIfNeeded(email, picture, displayName)
    )
      .subscribe(tenant => {

        this.store.dispatch(new Login(tenant));
        this.router.navigateByUrl('/courses');

      });
  }

  /**
   *
   * The user has logged in to the tenant website in the single sign-on page login.onlinecoursehost.com
   *
   * create a custom JWT token and send the it back to the tenant website. On arrival the user will be authenticated
   * using the custom JWT.
   *
   */

  handleTenantWebsiteLogin(email:string, picture:string, displayName:string) {
    this.loading.showLoader(
      this.afAuth.authState
        .pipe(
          filter(authState => !!authState.uid),
          concatMap(authState =>
            this.usersDB.saveLatestUserProfile(authState.uid, this.tenantId, email, picture, displayName)
              .pipe(
                map(() => authState.uid)
              )
          ),
          concatMap(uid => this.jwtService.createCustomJwt(uid))
        )
      )
      .subscribe(
        jwt => {
          if (jwt) {

            let redirectUrlWithAuthToken = `${this.redirectUrl}`;

            redirectUrlWithAuthToken += this.redirectUrl.includes('?') ? "&" : "?";

            redirectUrlWithAuthToken += `authJwtToken=${jwt}`;

            window.location.href = redirectUrlWithAuthToken;
          }
        }
      );

  }

  ngOnDestroy() {
    this.ui.delete();
  }


}
