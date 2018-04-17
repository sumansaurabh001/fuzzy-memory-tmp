import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AngularFirestore} from 'angularfire2/firestore';
import {concatMap, first, withLatestFrom} from 'rxjs/operators';
import {findUniqueMatchWithId, readDocumentWithId} from '../common/firestore-utils';

import {of} from 'rxjs/observable/of';
import {AngularFireAuth} from 'angularfire2/auth';
import {User} from '../models/user.model';


@Injectable()
export class TenantsDBService {


  constructor(private afs: AngularFirestore,
              private afAuth: AngularFireAuth) {

  }

  createTenantIfNeeded(email: string, pictureUrl: string): Observable<User> {

    return this.findTenantByUid()
      .pipe(
        withLatestFrom(this.afAuth.authState),
        concatMap(([tenant, authState]) => {

          if (tenant) {
            return of(tenant);
          }
          else {

            const newTenant = {email, pictureUrl, id: authState.uid, status: 'new'};

            return this.afs.doc(`tenants/${authState.uid}`)
              .set(newTenant)
              .then(() => {
                return {
                  ...newTenant,
                  isTenant: true
                };
              });
          }
        })
      );
  }

  findTenantByUid(): Observable<User> {
    return this.afAuth.authState
      .pipe(
        concatMap(authState => readDocumentWithId(this.afs.doc('tenants/' + authState.uid)))
      );


  }

}
