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

  constructor(private afs: AngularFirestore,
              private tenant: TenantService) {

    this.coursesPath = this.tenant.path('courses');

  }

  findCourseByUrl(courseUrl: string) {

    const courseQuery$ = this.afs.collection<Course>(this.coursesPath, ref => ref.where('url', '==', courseUrl));

    return findUniqueMatchWithId(courseQuery$).pipe(first());
  }


  findCourseBySeqNo(seqNo: number) {

    const courseQuery$ = this.afs.collection<Course>(this.coursesPath, ref => ref.where('seqNo', '==', seqNo));

    return findUniqueMatchWithId(courseQuery$).pipe(first());
  }

  suscribeToCourse(courseId: string): Observable<Course> {
    return readDocumentWithId(this.afs.doc(this.coursesPath + '/' + courseId));
  }

  findAllCourses(): Observable<Course[]> {
    return readCollectionWithIds<Course[]>(this.afs.collection(this.coursesPath, ref => ref.orderBy('seqNo'))).pipe(first());
  }

  createNewCourse(course: Course): Observable<Course> {

    const newCourse = {...course};

    return findLastBySeqNo<Course>(this.afs, this.coursesPath)
      .pipe(
        switchMap(lastCourse => {

          newCourse.seqNo = lastCourse ? (lastCourse.seqNo + 1) : 1;

          return fromPromise(this.afs.collection(this.coursesPath).add(newCourse));
        }),
        map(ref => {
          return {...newCourse, id: ref.id};
        })
      );
  }

  deleteCourseDraft(courseId: string): Observable<any> {
    return fromPromise(this.afs.collection(this.coursesPath).doc(courseId).delete());
  }

  saveCourse(courseId: any, props: Partial<Course>): Observable<any> {
    return fromPromise(this.afs.collection(this.coursesPath).doc(courseId).update(props));
  }

}




