import { Injectable } from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {Course} from '../../model/course.model';
import {Observable} from 'rxjs/Observable';
import {fromPromise} from 'rxjs/observable/fromPromise';
import {readCollectionWithIds} from '../common/firestore-utils';
import {_throw} from 'rxjs/observable/throw';
import {timer} from 'rxjs/observable/timer';
import {of} from 'rxjs/observable/of';
import {delay, tap} from 'rxjs/operators';

@Injectable()
export class CoursesService {


  constructor(private afs: AngularFirestore) {

  }


  findAllCourses(): Observable<Course[]> {
    return readCollectionWithIds<Course[]>(this.afs.collection('courses'));
  }

  createNewCourse(course:Course): Observable<any> {
    return of('Value').pipe(
      delay(1000),
      tap(()=> {throw "Error creating..."})
    );

    //TODO
  /*
    return fromPromise(
      this.afs.collection("courses").add(course)
    );

    */
  }



}




