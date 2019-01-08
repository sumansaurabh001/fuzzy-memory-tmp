import {Injectable} from '@angular/core';
import {Observable, of, from} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {concatMap, first, map, withLatestFrom} from 'rxjs/operators';
import {findLastBySeqNo, findUniqueMatchWithId, readDocumentWithId} from '../common/firestore-utils';
import {AngularFireAuth} from '@angular/fire/auth';
import {Tenant} from '../models/tenant.model';
import {AngularFirestoreCollection} from '@angular/fire/firestore/collection/collection';
import {DEFAULT_SCHOOL_ACCENT_COLOR, DEFAULT_SCHOOL_PRIMARY_COLOR} from '../common/ui-constants';
import {User} from '../models/user.model';
import {TenantSettings} from '../models/tenant-settings.model';


@Injectable()
export class TenantsDBService {


  constructor(private afs: AngularFirestore,
              private afAuth: AngularFireAuth) {

  }

  createTenantIfNeeded(email: string, pictureUrl: string = null, displayName:string = null): Observable<Tenant> {
    return this.findTenantByCurrentUid()
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
              brandTheme: {
                //default brand colors
                primaryColor: DEFAULT_SCHOOL_PRIMARY_COLOR,
                accentColor: DEFAULT_SCHOOL_ACCENT_COLOR
              }
            };

            const newSchoolUser = {
              id: authState.uid,
              email,
              pictureUrl,
              displayName
            };

            const batch = this.afs.firestore.batch();

            const schoolUserRef = this.afs.doc(`schools/${authState.uid}/users/${authState.uid}`).ref;
            batch.set(schoolUserRef, newSchoolUser);

            const tenantRef = this.afs.doc(`tenants/${authState.uid}`).ref;
            batch.set(tenantRef, newTenant);

            // the tenant is an admin in its own website (note that only the tenant can edit his own settings)
            const tenantSettingsRef = this.afs.doc(`tenantSettings/${authState.uid}/userPermissions/${authState.uid}`).ref;
            batch.set(tenantSettingsRef, {isAdmin:true});

            return from(batch.commit().then(() => newTenant));
          }
        })
      );
  }

  findTenantByCurrentUid(): Observable<Tenant> {
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

  findTenantById(tenantId:string) {
    return this.afs.doc<Tenant>(`tenants/${tenantId}`).valueChanges()
      .pipe(
        first()
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

    return from(this.afs.collection('tenants').doc(tenantId).update({brandTheme:{primaryColor, accentColor}}));

  }

}








