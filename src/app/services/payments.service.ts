import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {TenantService} from './tenant.service';
import {AngularFireAuth} from '@angular/fire/auth';



@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  private authJwtToken:string;

  constructor(
    private http: HttpClient,
    private tenant: TenantService,
    private afAuth: AngularFireAuth) {

    afAuth.idToken.subscribe(jwt => this.authJwtToken = jwt);

  }

  purchaseCourse(tokenId: string, paymentEmail: string, courseId) {

    const headers = new HttpHeaders()
      .set('Content-Type', "application/json")
      .set('Authorization',`Bearer ${this.authJwtToken}`);

    return this.http.post(
      environment.api.purchaseCourseUrl,
      {
        tokenId,
        courseId,
        tenantId: this.tenant.id
      },
      {
        headers
      });

  }


}
