import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {TenantService} from './tenant.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {PricingPlan} from '../models/pricing-plan.model';
import {Observable} from 'rxjs/Observable';
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

  createPurchaseCourseSession(courseId:string, courseUrl:string): Observable<StripeSession> {
    return this.http.post<StripeSession>(
      environment.api.purchaseCourseUrl,
      {
        courseId,
        courseUrl,
        tenantId: this.tenant.id
      });
  }

  activatePlan(tokenId: string, paymentEmail: string, plan: PricingPlan, oneTimeCharge: boolean): Observable<any> {

    return this.http.post(
      environment.api.stripeActivatePlanUrl,
      {
        tokenId,
        plan,
        tenantId: this.tenant.id,
        oneTimeCharge
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

  confirmCoursePurchased(ongoingPurchaseSessionId: string, courseId: string) {
    return this.http.post(
      environment.api.confirmCoursePurchasedUrl,
      {
        ongoingPurchaseSessionId,
        tenantId: this.tenant.id,
        courseId
      }
    );
  }
}
