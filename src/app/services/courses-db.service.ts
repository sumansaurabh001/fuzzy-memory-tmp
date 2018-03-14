import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {fromPromise} from 'rxjs/observable/fromPromise';
import {
  findLastBySeqNo, findUniqueMatchWithId, readCollectionWithIds, readDocumentValue,
  readDocumentWithId
} from '../common/firestore-utils';
import {TenantService} from './tenant.service';
import {filter, first, map, switchMap, tap} from 'rxjs/operators';
import {Course} from '../models/course.model';


@Injectable()
export class CoursesDBService {

  private coursesPath: string;
  private descriptions:string;

  constructor(private afs: AngularFirestore,
              private tenant: TenantService) {

    this.coursesPath = this.tenant.path('courses');
    this.descriptions = this.tenant.path('descriptions');

  }

  findCourseByUrl(courseUrl: string) {

    const courseQuery$ = this.afs.collection<Course>(this.coursesPath, ref => ref.where('url', '==', courseUrl));

    return findUniqueMatchWithId(courseQuery$).pipe(first());
  }


  suscribeToCourse(courseId: string): Observable<Course> {
    return readDocumentWithId(this.afs.doc(this.coursesPath + '/' + courseId));
  }

  findAllCourses(): Observable<Course[]> {
    return readCollectionWithIds<Course[]>(this.afs.collection(this.coursesPath, ref => ref.orderBy('seqNo'))).pipe(first());
  }

  createNewCourse(course: Course): Observable<Course> {
    return this.findCourseByUrl(course.url)
      .pipe(
        tap(result => {
          if (result) {
            throw 'Please choose another course url, this one is already in use.';
          }
        }),
        filter(result => !result),
        switchMap(() => findLastBySeqNo<Course>(this.afs, this.coursesPath)),
        switchMap(lastCourse => {

          const newCourse = {
            ...course,
            seqNo: lastCourse ? (lastCourse.seqNo + 1) : 1
          };

          return fromPromise(this.afs.collection(this.coursesPath).add(newCourse));
        }),
        map(ref => {
          return {...course, id: ref.id};
        })
      );
  }

  deleteCourseDraft(courseId: string): Observable<any> {
    return fromPromise(this.afs.collection(this.coursesPath).doc(courseId).delete());
  }

  updateCourse(course: Course, props: Partial<Course>): Observable<any> {
    return fromPromise(this.afs.collection(this.coursesPath).doc(course.id).update(props))
      .pipe(
        map(() => {
          return {...course, ...props};
        })
      );
  }

  findCourseDescription(courseId: string): Observable<string> {
    return readDocumentValue<Object>(this.afs.doc(this.descriptions + '/' + courseId))
      .pipe(
        map(val => val ? val['description'] : undefined)
      );
  }

  saveCourseDescription(course: Course, description: string): Observable<string> {
    return fromPromise(this.afs.collection(this.descriptions).doc(course.id).set({description}))
      .pipe(
        map(() => {
          return description;
        })
      );
  }
}




