import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {from,of} from 'rxjs';
import {concatMap} from 'rxjs/operators';
import {readDocumentWithId} from '../common/firestore-utils';
import {AngularFireAuth} from '@angular/fire/auth';
import {TenantService} from './tenant.service';


@Injectable({
  providedIn: 'root'
})
export class SchoolUsersDbService {

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth, private tenant:TenantService) {

  }

  saveLatestUserProfile(userId: string, tenantId: string, email: string, displayName: string) {

    const addUserAsync = this.afs
      .doc(`schools/${tenantId}/users/${userId}`)
      .set(
        {
          email,
          displayName
        },
        {
          merge: true
        }
      );

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

}
