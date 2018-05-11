import {Injectable} from '@angular/core';
import {Observable, of, from as fromPromise} from 'rxjs';
import {AngularFirestore} from 'angularfire2/firestore';
import {concatMap, first, map, tap, withLatestFrom} from 'rxjs/operators';
import {findLastBySeqNo, findUniqueMatchWithId, readDocumentWithId} from '../common/firestore-utils';
import {AngularFireAuth} from 'angularfire2/auth';
import {User} from '../models/user.model';
import {Tenant} from '../models/tenant.model';
import {Lesson} from '../models/lesson.model';
import {AngularFirestoreCollection} from 'angularfire2/firestore/collection/collection';
import {DEFAULT_SCHOOL_ACCENT_COLOR, DEFAULT_SCHOOL_PRIMARY_COLOR} from '../common/ui-constants';


@Injectable()
export class TenantsDBService {


  constructor(private afs: AngularFirestore,
              private afAuth: AngularFireAuth) {

  }

  createTenantIfNeeded(email: string, pictureUrl: string = null, displayName:string = null): Observable<Tenant> {
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
              status: 'new',
              displayName,
              //default brand colors
              primaryColor: DEFAULT_SCHOOL_PRIMARY_COLOR,
              accentColor: DEFAULT_SCHOOL_ACCENT_COLOR

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

  findTenantBySubdomain(subDomain: string): Observable<Tenant> {

    const seqNo = parseInt(subDomain);

    let query$: AngularFirestoreCollection<Tenant>;

    if (!isNaN(seqNo)) {
      query$ = this.afs
        .collection<Tenant>('tenants', ref => ref.where('seqNo', '==', seqNo).limit(1));
    }
    else {
      query$ = this.afs
        .collection<Tenant>('tenants', ref => ref.where('subDomain', '==', subDomain).limit(1));

    }
    return findUniqueMatchWithId(query$).pipe(first());
  }


  saveTheme(tenantId: string, primaryColor:string, accentColor:string) : Observable<any> {

    return fromPromise(this.afs.collection('tenants').doc(tenantId).update({primaryColor, accentColor}));

  }

}








