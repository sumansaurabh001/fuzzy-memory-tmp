import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {AngularFireAuth} from 'angularfire2/auth';
import {map, tap} from 'rxjs/operators';


@Injectable()
export class AnonymousOnlyGuard implements CanActivate {


  constructor(private afAuth: AngularFireAuth, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.afAuth.authState
      .pipe(
        map(authState => !authState || authState.isAnonymous),
        tap(isAnonymous => {
          if (!isAnonymous) {
            this.router.navigateByUrl('/courses');
          }
        })
      );
  }


}
