import { Injectable } from '@angular/core';
import {PricingPlan} from '../models/pricing-plan.model';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import {AngularFireAuth} from '@angular/fire/auth';
import {environment} from '../../environments/environment';
import {AngularFirestore} from '@angular/fire/firestore';
import {TenantService} from './tenant.service';
import {PricingPlansState} from '../store/pricing-plans.reducer';
import {of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PricingPlansService {

  private authJwtToken:string;

  constructor(
    private http: HttpClient,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private tenant: TenantService) {

    afAuth.idToken.subscribe(jwt => this.authJwtToken = jwt);

  }

  updateStripePricingPlan(planName: string, changes: Partial<PricingPlan>): Observable<Partial<PricingPlan>> {

    const headers = new HttpHeaders()
      .set('Content-Type', "application/json")
      .set('Authorization',`Bearer ${this.authJwtToken}`);

    return this.http.post(environment.api.stripeUpdatePricingPLanUrl, {planName, changes}, {headers});

  }

  updatePlans(pricingPlans: PricingPlansState):Observable<any> {
    return of(this.afs.doc(`tenants/${this.tenant.id}`).update({pricingPlans}));
  }



}
