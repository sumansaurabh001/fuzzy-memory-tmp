import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import {LoadingService} from '../services/loading.service';
import {TenantsDBService} from '../services/tenants-db.service';
import {AppState} from '../store';
import {Store} from '@ngrx/store';
import {Login} from '../store/auth.actions';
import {Router} from '@angular/router';


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  ui: firebaseui.auth.AuthUI;

  isPlatformSite:boolean;

  constructor(
    public afAuth: AngularFireAuth,
    private tenantsDB: TenantsDBService,
    private loading: LoadingService,
    private store: Store<AppState>,
    private router: Router) {

    const hostName = document.location.hostname;

    this.isPlatformSite = hostName.includes('onlinecoursehost');

  }

  ngOnInit() {

    this.loading.loadingOn();

    try {

      const uiConfig = {
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.FacebookAuthProvider.PROVIDER_ID,
          firebase.auth.TwitterAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        callbacks: {

          signInSuccessWithAuthResult: (result) => {

            const user = result.user;
            const credential = result.credential;
            const isNewUser = result.additionalUserInfo.isNewUser;
            const providerId = result.additionalUserInfo.providerId;
            const operationType = result.operationType;

            const email = result.additionalUserInfo.profile.email,
                  picture = result.additionalUserInfo.profile.picture,
                  token = result.credential.accessToken;

            if (this.isPlatformSite) {

              this.tenantsDB
                .createTenantIfNeeded(email, picture)
                .subscribe(tenant => {

                  this.store.dispatch(new Login(tenant));

                  this.router.navigateByUrl('/courses');

                });
            }

            return false;
          },
          uiShown: () => {
            this.loading.loadingOff();
          }
        }
      };

      this.ui = new firebaseui.auth.AuthUI(this.afAuth.auth);

      // The start method will wait until the DOM is loaded.
      this.ui.start('#firebaseui-auth-container', uiConfig);

    }
    catch(err) {
      this.loading.loadingOff();
    }

  }

  ngOnDestroy() {
    this.ui.delete();
  }



}
