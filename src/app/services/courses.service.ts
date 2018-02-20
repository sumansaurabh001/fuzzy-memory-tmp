import { Injectable } from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {Course} from '../../model/course.model';
import {Observable} from 'rxjs/Observable';
import {fromPromise} from 'rxjs/observable/fromPromise';
import {first} from 'rxjs/operators';

@Injectable()
export class CoursesService {


  constructor(private afs: AngularFirestore) {

  }


  findAllCourses():Observable<Course[]> {
      return this.afs.collection<Course>("courses").valueChanges()
        .pipe(
          first()
        );
  }

  createNewCourse(course:Course): Observable<any> {
    return fromPromise(
      this.afs.collection("courses").add(course)
    );
  }



}
