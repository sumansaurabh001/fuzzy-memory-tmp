import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {from,of} from 'rxjs';
import {concatMap, map} from 'rxjs/operators';
import {readDocumentWithId} from '../common/firestore-utils';
import {AngularFireAuth} from '@angular/fire/auth';
import {TenantService} from './tenant.service';
import {Observable} from 'rxjs/Observable';


@Injectable({
  providedIn: 'root'
})
export class SchoolUsersDbService {

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private tenant:TenantService) {

  }

  saveLatestUserProfile(userId: string, tenantId: string, email: string) {

    const addUserAsync = this.afs
      .doc(`schools/${tenantId}/users/${userId}`)
      .set({email}, {merge: true});

    return from(addUserAsync);
  }

  findUserByCurrentUid() {
    return this.afAuth.authState
      .pipe(
        concatMap(authState => {
          if (!authState) {
            return of(undefined);
          }

          return readDocumentWithId(this.afs.doc(`schools/${this.tenant.id}/users/${authState.uid}`));

        })
      );
  }

  loadUserCourses(tenantId:string, userId: string): Observable<string[]> {
    return this.afs.doc(`schools/${tenantId}/userCourses/${userId}`)
      .get()
      .pipe(
        map(snap => {
          const data = snap.data();
          if (!snap.exists || !data.purchasedCourses) {
            return [];
          }
          return data.purchasedCourses;
        })
      );
  }

}
