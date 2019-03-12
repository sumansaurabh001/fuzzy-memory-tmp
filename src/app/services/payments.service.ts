import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {TenantService} from './tenant.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {PricingPlan} from '../models/pricing-plan.model';
import {Observable} from 'rxjs/Observable';



@Injectable({
  providedIn: 'root'
})
export class PaymentsService {



  constructor(
    private http: HttpClient,
    private tenant: TenantService) {



  }

  purchaseCourse(tokenId: string, paymentEmail: string, courseId): Observable<any> {

    return this.http.post(
      environment.api.purchaseCourseUrl,
      {
        tokenId,
        courseId,
        tenantId: this.tenant.id
      });
  }

  activatePlan(tokenId: string, paymentEmail: string, plan: PricingPlan, oneTimeCharge:boolean): Observable<any> {

    return this.http.post(
      environment.api.stripeActivatePlanUrl,
      {
        tokenId,
        plan,
        tenantId: this.tenant.id,
        oneTimeCharge
      });
  }


}
