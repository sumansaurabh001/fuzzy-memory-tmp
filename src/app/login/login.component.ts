import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import {LoadingService} from '../services/loading.service';


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  ui: firebaseui.auth.AuthUI;

  constructor(public afAuth: AngularFireAuth, private loading: LoadingService) {

  }

  ngOnInit() {


    this.afAuth.auth.getRedirectResult()
      .then(result => {

        console.log("");

      })
      .catch(err => console.log("Authentication failed, reason:", err));


    this.loading.loadingOn();

    try {

      const uiConfig = {
        //signInSuccessUrl: 'http://localhost:4201/courses',
        signInOptions: [
          // Leave the lines as is for the providers you want to offer your users.
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.FacebookAuthProvider.PROVIDER_ID,
          firebase.auth.TwitterAuthProvider.PROVIDER_ID,
          //firebase.auth.GithubAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        callbacks: {
          signInSuccessWithAuthResult: (authResult, redirectUrl) => {
            const user = authResult.user;
            const credential = authResult.credential;
            const isNewUser = authResult.additionalUserInfo.isNewUser;
            const providerId = authResult.additionalUserInfo.providerId;
            const operationType = authResult.operationType;

            console.log(authResult);

            // Do something with the returned AuthResult.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
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
