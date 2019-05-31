import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Email} from '../models/email.model';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {TenantService} from './tenant.service';


@Injectable({
  providedIn:'root'
})
export class EmailService {

  constructor(
    private http: HttpClient,
    private tenant: TenantService) {

  }

  sendEmail(email:Email): Observable<any> {
    return this.http.post(environment.api.sendEmailUrl,
      {
        email,
        tenantId: this.tenant.id
      });
  }


}
