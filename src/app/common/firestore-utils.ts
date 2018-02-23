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




export function findUniqueMatchWithId<T>(col: AngularFirestoreCollection<T>): Observable<T | null> {
  return <any>col.snapshotChanges()
    .pipe(
      first(),
      map( results => {

        if (results.length > 1) {
          throw 'Found multiple matches to a unique result query.';
        }

        let result = null;

        if (results.length == 1) {
          result = {
            id: results[0].payload.doc.id,
            ...(results[0].payload.doc.data())
          };
        }
        return result;
      })
    );
}
