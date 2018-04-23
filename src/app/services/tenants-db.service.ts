import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AngularFirestore} from 'angularfire2/firestore';
import {concatMap, first, map, tap, withLatestFrom} from 'rxjs/operators';
import {findLastBySeqNo, findUniqueMatchWithId, readDocumentWithId} from '../common/firestore-utils';

import {of} from 'rxjs/observable/of';
import {AngularFireAuth} from 'angularfire2/auth';
import {User} from '../models/user.model';
import {Tenant} from '../models/tenant.model';
import {Lesson} from '../models/lesson.model';


@Injectable()
export class TenantsDBService {


  constructor(private afs: AngularFirestore,
              private afAuth: AngularFireAuth) {

  }

  createTenantIfNeeded(email: string, pictureUrl: string): Observable<Tenant> {

    return this.findTenantByUid()
      .pipe(
        withLatestFrom(this.afAuth.authState, this.findLastTenantSeqNo()),
        concatMap(([tenant, authState, seqNo]) => {

          if (!authState) {
            return of(undefined);
          }

          if (tenant) {
            return of(tenant);
          }
          else {

            const newTenant = {
              id: authState.uid,
              seqNo,
              email,
              pictureUrl,
              status: 'new'
            };

            return this.afs.doc(`tenants/${authState.uid}`)
              .set(newTenant)
              .then(() => newTenant);
          }
        })
      );
  }

  findTenantByUid(): Observable<Tenant> {
    return this.afAuth.authState
      .pipe(
        concatMap(authState => {
          if (!authState) {
            return of(undefined);
          }
          return readDocumentWithId(this.afs.doc('tenants/' + authState.uid));

        })
      );
  }

  findLastTenantSeqNo() : Observable<number> {
    return findLastBySeqNo<Tenant>(this.afs, "tenants")
      .pipe(
        map(last => {
          return last ? last.seqNo + 1 : 4200;
        })
      );
  }

  findTenantBySubdomain(subDomainSeqNo: number): Observable<Tenant> {

    const query$ = this.afs
      .collection<Tenant>('tenants', ref => ref.where('seqNo', '==', subDomainSeqNo).limit(1));

    return findUniqueMatchWithId(query$).pipe(first());
  }


}








