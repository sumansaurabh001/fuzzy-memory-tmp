import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CustomJwtAuthService {


  constructor(private http: HttpClient) {

  }

  createCustomJwt(uid:string): Observable<string> {
    return this.http.post(`${environment.api.customJwtUrl}/custom-jwt`, {uid})
      .pipe(
        map(res => res['customJWt'])
      );
  }


}
