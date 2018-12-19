import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {from} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersDbService {

  constructor(private afs: AngularFirestore) {

  }

  usersPath(tenantId: string) {
    return `schools/${tenantId}/users`;
  }

  saveLatestUserProfile(userId: string, tenantId: string, email: string, pictureUrl: string, displayName: string) {

    const addUserAsync = this.afs
      .doc(`${this.usersPath(tenantId)}/${userId}`)
      .set(
        {
          email,
          pictureUrl,
          displayName
        },
        {
          merge: true
        }
      );

    return from(addUserAsync);
  }

}
