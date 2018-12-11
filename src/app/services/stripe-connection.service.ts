import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {TenantService} from './tenant.service';


@Injectable({
  providedIn: 'root'
})
export class StripeConnectionService {

  constructor(
    private http:HttpClient,
    private tenant: TenantService) { }

  initStripeConnection(authorizationCode: string): Observable<any> {

    const headers = new HttpHeaders().set('Content-Type', "application/json");

    return this.http.post(environment.api.stripeConnectionUrl, {authorizationCode, tenantId: this.tenant.id}, {headers});
  }


}
