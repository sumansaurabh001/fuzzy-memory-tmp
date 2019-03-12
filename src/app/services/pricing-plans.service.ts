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


  constructor(
    private http: HttpClient,
    private afs: AngularFirestore,
    private tenant: TenantService) {


  }

  updateStripePricingPlan(planName: string, changes: Partial<PricingPlan>): Observable<Partial<PricingPlan>> {

    return this.http.post(environment.api.stripeUpdatePricingPLanUrl, {planName, changes});

  }

  updatePlans(pricingPlans: PricingPlansState):Observable<any> {
    return of(this.afs.doc(`tenants/${this.tenant.id}`).update({pricingPlans}));
  }



}
