import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {from, of, forkJoin, Observable} from 'rxjs';
import {concatMap, first, map} from 'rxjs/operators';
import {readDocumentWithId} from '../common/firestore-utils';
import {AngularFireAuth} from '@angular/fire/auth';
import {TenantService} from './tenant.service';
import {User} from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class SchoolUsersDbService {

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private tenant: TenantService) {

  }

  saveLatestUserProfile(userId: string, tenantId: string, email: string = null, pictureUrl: string = null) {

    const addUserAsync = this.afs
      .doc(`schools/${tenantId}/users/${userId}`)
      .set({email, pictureUrl}, {merge: true});

    return from(addUserAsync);
  }

  findUserByUid(uid:string): Observable<User> {
    return forkJoin(
        readDocumentWithId<User>(this.afs.doc(`schools/${this.tenant.id}/users/${uid}`)).pipe(first()),
        readDocumentWithId<User>(this.afs.doc(`schools/${this.tenant.id}/usersPrivate/${uid}`)).pipe(first())
      )
      .pipe(
        map(([data, privateData]) => {
          return {
            ...data,
            ...privateData
          }
        })
      );
  }

  loadUserCourses(tenantId: string, userId: string): Observable<string[]> {
    return this.afs.doc(`schools/${tenantId}/usersPrivate/${userId}`)
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
