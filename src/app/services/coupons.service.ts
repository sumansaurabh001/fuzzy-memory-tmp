import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TenantService} from './tenant.service';
import {Observable} from 'rxjs';
import {StripeSession} from './stripe-session';
import {environment} from '../../environments/environment';


@Injectable()
export class CouponsService {


  constructor(
    private http: HttpClient,
    private tenant: TenantService) {

  }

  fulfillFreeCourseCoupon(courseId:string, couponCode:string): Observable<any> {
    return this.http.post<any>(
      environment.api.fulfillFreeCouponUrl,
      {
        courseId,
        tenantId: this.tenant.id,
        couponCode
      });


  }

}
