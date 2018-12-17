import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {TenantService} from './tenant.service';
import {map} from 'rxjs/operators';

const STRIPE_CONNECTION_API_ENDPOINT =`${environment.api.stripeConnectionUrl}/stripe-connection`;


@Injectable({
  providedIn: 'root'
})
export class StripeConnectionService {

  constructor(
    private http:HttpClient,
    private tenant: TenantService) { }

  initStripeConnection(authorizationCode: string): Observable<any> {

    const headers = new HttpHeaders().set('Content-Type', "application/json");

    return this.http.post(STRIPE_CONNECTION_API_ENDPOINT, {authorizationCode, tenantId: this.tenant.id}, {headers});
  }

  isConnectedToStripe(tenantId:string): Observable<boolean> {

    const params = new HttpParams().set("tenantId", tenantId);

    return this.http.get<any>(STRIPE_CONNECTION_API_ENDPOINT, {params})
      .pipe(map(res => res.isConnectedToStripe));
  }

}
