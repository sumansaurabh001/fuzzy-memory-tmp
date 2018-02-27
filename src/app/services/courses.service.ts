import { Injectable } from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {Course} from '../../model/course.model';
import {Observable} from 'rxjs/Observable';
import {fromPromise} from 'rxjs/observable/fromPromise';
import {findUniqueMatchWithId, readCollectionWithIds} from '../common/firestore-utils';
import {LoadingService} from './loading.service';
import {TenantService} from './tenant.service';
import {filter, switchMap, tap} from 'rxjs/operators';




@Injectable()
export class CoursesService {

  private coursesPath:string;

  constructor(
    private afs: AngularFirestore,
    private loading: LoadingService,
    private tenant: TenantService) {

    this.coursesPath = this.tenant.path('courses');

  }

  findCourseByUrl(courseUrl: string) {

    const courseQuery$ =  this.afs.collection<Course>(this.coursesPath, ref => ref.where('url', '==', courseUrl));

    return this.loading.showLoaderWhileBusy(findUniqueMatchWithId(courseQuery$));

  }

  findAllCourses(): Observable<Course[]> {
    return readCollectionWithIds<Course[]>(this.afs.collection(this.coursesPath));
  }

  createNewCourse(course:Course): Observable<any> {
    return this.loading.showLoaderWhileBusy(
      this.findCourseByUrl(course.url).pipe(
        tap(result => {
          if (result) {
            throw 'Please choose another course url, this one is already in use.';
          }
        }),
        filter(result => !result),
        switchMap(() => fromPromise(this.afs.collection(this.coursesPath).add(course)))
      )
    );
  }


  deleteCourseDraft(courseId:string): Observable<any> {
    return this.loading.showLoaderWhileBusy(
      fromPromise(this.afs.collection(this.coursesPath).doc(courseId).delete())
    );

  }
}




