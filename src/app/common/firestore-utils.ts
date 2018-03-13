import {filter, first, map} from 'rxjs/operators';
import {AngularFirestoreCollection} from 'angularfire2/firestore/collection/collection';
import {Observable} from 'rxjs/Observable';
import {AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Course} from '../models/course.model';


export function readDocumentWithId<T>(doc: AngularFirestoreDocument<T>): Observable<T> {
  return <any>doc.snapshotChanges()
    .pipe(
      map(action => {

        const id = action.payload.id,
          data = action.payload.data();

        return {...data, id};
      })
    );
}

export function readDocumentValue<T>(doc: AngularFirestoreDocument<T>): Observable<T> {
  return <any>doc.snapshotChanges()
    .pipe(
      map(action => action.payload.data())
    );
}


export function readCollectionWithIds<T>(col: AngularFirestoreCollection<T>): Observable<T> {
  return <any>col.snapshotChanges()
    .pipe(
      map(snaps => snaps.map(snap => {

        const id = snap.payload.doc.id;
        const data = snap.payload.doc.data();

        return {...data, id};
      })),
      first()
    );
}


export function findUniqueMatchWithId<T>(col: AngularFirestoreCollection<T>): Observable<T | null> {
  return <any>col.snapshotChanges()
    .pipe(
      map(results => {

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


export function findLastBySeqNo<T>(afs: AngularFirestore, collectionPath: string): Observable<T> {

  const query$ = afs.collection<T>(collectionPath, ref => ref.orderBy('seqNo', 'desc').limit(1));

  return findUniqueMatchWithId(query$).pipe(first());
}
