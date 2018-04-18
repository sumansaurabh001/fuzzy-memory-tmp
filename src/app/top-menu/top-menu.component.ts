import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store';
import {isLoggedIn, isLoggedOut, userPictureUrl} from '../store/selectors';
import {Logout} from '../store/auth.actions';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';
import {LoadingService} from '../services/loading.service';

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

  constructor(
    private store: Store<AppState>,
    private afAuth: AngularFireAuth,
    private router: Router,
    private loading: LoadingService) {

  }

  ngOnInit() {

    this.isLoggedIn$ = this.store.pipe(select(isLoggedIn));

    this.isLoggedOut$ = this.store.pipe(select(isLoggedOut));

    this.pictureUrl$ = this.store.pipe(select(userPictureUrl));

  }

  logout() {
    this.afAuth.auth.signOut();
    this.store.dispatch(new Logout());
    this.router.navigateByUrl('/courses');
    this.loading.loadingOn();
    window.location.reload();
  }

}
