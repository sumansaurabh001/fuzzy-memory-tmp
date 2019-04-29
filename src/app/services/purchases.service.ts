import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {PurchaseSession} from '../models/purchase-session.model';
import {readDocumentWithId} from '../common/firestore-utils';
import {TenantService} from './tenant.service';


@Injectable({
  providedIn: 'root' 
})
export class PurchasesService {


  constructor(
    private afs: AngularFirestore,
    private tenant: TenantService) {

  }

  waitForPurchaseCompletion(ongoingPurchaseSessionId: string): Observable<PurchaseSession> {
    return readDocumentWithId<PurchaseSession>(
      this.afs.doc(`schools/${this.tenant.id}/purchaseSessions/${ongoingPurchaseSessionId}`)
    );
  }

}
