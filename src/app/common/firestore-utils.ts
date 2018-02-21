import {first, map} from 'rxjs/operators';
import {AngularFirestoreCollection} from 'angularfire2/firestore/collection/collection';
import {Observable} from 'rxjs/Observable';


export function readCollectionWithIds<T>(col: AngularFirestoreCollection<T>): Observable<T> {
  return <any>col.snapshotChanges()
    .pipe(
      first(),
      map(snaps => snaps.map(snap => {

        const id = snap.payload.doc.id;
        const data = snap.payload.doc.data();

        return {...data, id};
      }))
    );
}
