import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {TenantService} from './tenant.service';
import {Observable} from 'rxjs/internal/Observable';
import {environment} from '../../environments/environment';
import {EmailGroup} from '../models/email-group.model';
import {AngularFireAuth} from '@angular/fire/auth';


@Injectable({
  providedIn:'root'
})
export class NewsletterService {

  private authJwtToken:string;

  constructor(
    private http: HttpClient,
    private tenant: TenantService,
    private afAuth: AngularFireAuth) {

    afAuth.idToken.subscribe(jwt => this.authJwtToken = jwt);

  }

  addToNewsletter(email:string): Observable<any> {
    return this.http.post<any>(
      environment.api.newsletterUrl,
      {
        tenantId: this.tenant.id,
        email
      });
  }

  loadEmailGroups(emailProviderId:string, apiKey:string): Observable<EmailGroup[]> {

    const params = new HttpParams()
      .set("emailProviderId", emailProviderId)
      .set("apiKey", apiKey);

    return this.http.get<EmailGroup[]>(
      `${environment.api.newsletterUrl}/email-groups`, {params});
  }

  downloadAllEmails() {

    window.open(environment.api.downloadEmailsUrl + `?idToken=${this.authJwtToken}`);

  }

}
