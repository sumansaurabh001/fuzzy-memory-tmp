import { Injectable } from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {Course} from '../../model/course.model';
import {Observable} from 'rxjs/Observable';
import {fromPromise} from 'rxjs/observable/fromPromise';
import {findUniqueMatchWithId, readCollectionWithIds} from '../common/firestore-utils';
import {LoadingService} from './loading.service';




@Injectable()
export class CoursesService {

  constructor(
    private afs: AngularFirestore,
    private loading: LoadingService) {

  }

  findCourseByUrl(courseUrl: string) {
    return findUniqueMatchWithId(
      this.afs.collection<Course>(
        'courses',
          ref => ref.where('url', '==', courseUrl)
      )
    );
  }

  findAllCourses(): Observable<Course[]> {
    return readCollectionWithIds<Course[]>(this.afs.collection('courses'));
  }

  createNewCourse(course:Course): Observable<any> {
    return this.loading.showLoaderWhileBusy(
      fromPromise(this.afs.collection("courses").add(course))
    );
  }


  deleteCourseDraft(courseId:string): Observable<any> {
    return this.loading.showLoaderWhileBusy(
      fromPromise(this.afs.collection('courses').doc(courseId).delete())
    );

  }
}




