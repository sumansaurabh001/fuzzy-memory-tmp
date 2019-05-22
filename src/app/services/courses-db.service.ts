import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable, from} from 'rxjs';
import {
  findLastBySeqNo, findUniqueMatchWithId, readCollectionWithIds, readDocumentValue,
  readDocumentWithId
} from '../common/firestore-utils';
import {TenantService} from './tenant.service';
import {filter, first, map, switchMap, tap} from 'rxjs/operators';
import {Course} from '../models/course.model';
import {Update} from '@ngrx/entity';
import {Lesson} from '../models/lesson.model';
import {CourseSection} from '../models/course-section.model';


@Injectable()
export class CoursesDBService {

  constructor(private afs: AngularFirestore,
              private tenant: TenantService) {



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

  createNewCourse(course: Course): Observable<void> {
    return from(this.afs.doc(`${this.coursesPath}/${course.id}`).set(course));
  }

  deleteCourseDraft(courseId: string): Observable<any> {
    return from(this.afs.collection(this.coursesPath).doc(courseId).delete());
  }

  saveCourse(courseId: any, props: Partial<Course>): Observable<any> {
    return from(this.afs.collection(this.coursesPath).doc(courseId).update(props));
  }

  private get coursesPath() {
    return this.tenant.path('courses');
  }

  updateCourses(changes: Update<Course>[]) {

      const batch = this.afs.firestore.batch();

      changes.forEach(change => {
        const courseRef = this.afs.doc(`schools/${this.tenant.id}/courses/${change.id}`).ref;
        batch.update(courseRef, change.changes);
      });

      return from(batch.commit());

  }

  updateCourseSections(courseId:string, changes: Update<CourseSection>[]) {

    const batch = this.afs.firestore.batch();

    changes.forEach(change => {
      const courseRef = this.afs.doc(`schools/${this.tenant.id}/courses/${courseId}/sections/${change.id}`).ref;
      batch.update(courseRef, change.changes);
    });

    return from(batch.commit());

  }

}




