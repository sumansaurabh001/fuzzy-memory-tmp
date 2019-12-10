import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {TenantService} from './tenant.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {PricingPlan} from '../models/pricing-plan.model';
import {Observable} from 'rxjs';
import {User} from '../models/user.model';
import {map} from 'rxjs/operators';
import {StripeSession} from './stripe-session';


@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  constructor(
    private http: HttpClient,
    private tenant: TenantService) {

  }

  createPurchaseCourseSession(courseId:string, courseUrl:string, couponCode:string): Observable<StripeSession> {
    return this.http.post<StripeSession>(
      environment.api.purchaseCourseUrl,
      {
        courseId,
        courseUrl,
        tenantId: this.tenant.id,
        couponCode
      });
  }

  createActivatePlanSession(plan: PricingPlan, quantity:number, oneTimeCharge: boolean, subscriptionUrl:string, isTeamPlan:boolean): Observable<StripeSession> {
    return this.http.post<StripeSession>(
      environment.api.stripeActivatePlanUrl,
      {
        plan,
        quantity,
        subscriptionUrl,
        tenantId: this.tenant.id,
        oneTimeCharge,
        isTeamPlan
      });
  }

  createUpdateCardSession(userSettingsUrl:string, stripeCustomerId): Observable<StripeSession> {
    return this.http.post<StripeSession>(
      environment.api.stripeUpdateCardUrl,
      {
        userSettingsUrl,
        stripeCustomerId,
        tenantId: this.tenant.id
      });
  }

  cancelPlan(user: User, reason: string): Observable<any> {
    return this.http.post(
      environment.api.stripeCancelPlanUrl,
      {
        user,
        tenantId: this.tenant.id,
        reason
      }
    );
  }


}
