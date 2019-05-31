import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {map, tap} from 'rxjs/operators';


/*
*
* Guard to prevent unauthenticated users from accessing parts of the website that require the user to be logged in.
*
*
* */

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(private afAuth: AngularFireAuth, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this.afAuth.authState
      .pipe(
        tap(auth => {
          if (!auth) {
            this.router.navigate(['/login']);
          }
        }),
        map(auth => !!auth)
      );

  }



}
