import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {AngularFireAuth} from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class CustomJwtAuthService {


  constructor(private http: HttpClient, private afAuth: AngularFireAuth) {

  }

  createCustomJwt(uid:string, authJwtToken:string): Observable<string> {

    const headers = new HttpHeaders()
      .set('Authorization',`Bearer ${authJwtToken}`);

    return this.http.post(`${environment.api.customJwtUrl}/custom-jwt`, {uid}, {headers})
      .pipe(
        map(res => res['customJWt'])
      );
  }


}
