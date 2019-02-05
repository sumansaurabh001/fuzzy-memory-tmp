import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {TenantService} from './tenant.service';
import {map} from 'rxjs/operators';
import {PricingPlanDetails} from '../models/pricing-plan-details.model';
import {AngularFireAuth} from '@angular/fire/auth';



@Injectable({
  providedIn: 'root'
})
export class StripeConnectionService {

  private authJwtToken:string;

  constructor(
    private http:HttpClient,
    private tenant: TenantService,
    private afAuth: AngularFireAuth) {

    afAuth.idToken.subscribe(jwt => this.authJwtToken = jwt);

  }

  initStripeConnection(authorizationCode: string): Observable<any> {

    const headers = new HttpHeaders().set('Content-Type', "application/json");

    return this.http.post(environment.api.stripeConnectionUrl, {authorizationCode, tenantId: this.tenant.id}, {headers});
  }

  isConnectedToStripe(tenantId:string): Observable<boolean> {

    const params = new HttpParams().set("tenantId", tenantId);

    return this.http.get<any>(environment.api.stripeConnectionUrl, {params})
      .pipe(map(res => res.isConnectedToStripe));
  }


  setupDefaultPricingPlans(monthlyPlanDescription:string, yearlyPlanDescription:string,
                           monthlyPlanPrice:number, yearlyPlanPrice: number, lifetimeAccessPrice:number): Observable<PricingPlanDetails> {

    const headers = new HttpHeaders()
      .set('Authorization',`Bearer ${this.authJwtToken}`);

    return this.http.post<PricingPlanDetails>(environment.api.stripeInitPricingPlansUrl,
      {
        monthlyPlanDescription,
        yearlyPlanDescription,
        monthlyPlanPrice,
        yearlyPlanPrice,
        lifetimeAccessPrice
      },
      {headers});
  }
}
