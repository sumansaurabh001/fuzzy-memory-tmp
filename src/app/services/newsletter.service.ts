import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TenantService} from './tenant.service';
import {Observable} from 'rxjs/internal/Observable';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn:'root'
})
export class NewsletterService {

  constructor(
    private http: HttpClient,
    private tenant: TenantService) {

  }

  addToNewsletter(email:string): Observable<any> {
    return this.http.post<any>(
      environment.api.addToNewsletterUrl,
      {
        tenantId: this.tenant.id,
        email
      });
  }

}
