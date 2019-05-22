import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable,from} from 'rxjs';
import {TenantService} from './tenant.service';
import {CourseSection} from '../models/course-section.model';
import {findLastBySeqNo, findUniqueMatchWithId, readCollectionWithIds, readDocumentWithId} from '../common/firestore-utils';
import {concatMap, first, map} from 'rxjs/operators';
import {Lesson} from '../models/lesson.model';
import {Course} from '../models/course.model';
import {Update} from '@ngrx/entity';
import {UpdateStr} from '@ngrx/entity/src/models';
import * as firebase from 'firebase/app';

@Injectable()
export class LessonsDBService {

  constructor(private afs: AngularFirestore,
              private tenant: TenantService) {

  }


  loadCourseSections(courseId: string): Observable<CourseSection[]> {

    const coursePath = this.tenant.path(`courses/${courseId}`);

    return readCollectionWithIds<CourseSection[]>(this.afs.collection(coursePath + '/sections', ref => ref.orderBy('seqNo'))).pipe(
      map(sections => sections.map(section => {return {...section, courseId}})));

  }

  loadCourseLessons(courseId: string): Observable<Lesson[]> {

    const coursePath = this.tenant.path(`courses/${courseId}`);

    return readCollectionWithIds<Lesson[]>(this.afs.collection(coursePath + '/lessons', ref => ref.orderBy('seqNo')));

  }


  addNewSection(course: Course, title: string):Observable<CourseSection> {
    return findLastBySeqNo<CourseSection>(this.afs, this.sectionsPath(course.id))
      .pipe(
        concatMap(last => {

          const newSection: any = {
            title,
            seqNo: last ? (last.seqNo + 1) : 1
          };

          const addSectionAsync = this.afs.collection(this.sectionsPath(course.id))
            .add(newSection)
            .then(ref => {
              return {
                id:ref.id,
                courseId: course.id,
                ...newSection
              }
            });

          return from(addSectionAsync);
        })
      );
  }

  saveSection(courseId: string, sectionId:string, update: UpdateStr<CourseSection>): Observable<any> {
    return from(this.afs.collection(this.sectionsPath(courseId)).doc(update.id).update(update.changes));
  }


  addNewLesson(courseId: string, sectionId: string, title: string): Observable<Lesson> {
    return this.findLastLessonInSection(courseId, sectionId)
      .pipe(
        concatMap(last => {

          const newLesson: any = {
            title,
            seqNo: last ? (last.seqNo + 1) : 1,
            sectionId,
            status: 'draft',
            free:false

          };

          const addLessonAsync = this.afs.collection(this.lessonsPath(courseId))
            .add(newLesson)
            .then(ref => {
              return {
                id:ref.id,
                ...newLesson
              }
            });

          return from(addLessonAsync);
        })
      );
  }

  saveLesson(courseId: string, update: UpdateStr<Lesson>): Observable<any> {
    return from(this.afs.collection(this.lessonsPath(courseId)).doc(update.id).update(update.changes));
  }

  deleteSection(courseId: string, sectionId: string): Observable<any> {
    return from(this.afs.collection(this.sectionsPath(courseId)).doc(sectionId).delete());
  }

  deleteLesson(courseId: string, lessonId:string, videoDuration:number): Observable<any> {

    const batch = this.afs.firestore.batch();

    const lessonRef = this.afs.collection(this.lessonsPath(courseId)).doc(lessonId).ref;

    batch.delete(lessonRef);

    const courseRef = this.afs.doc(`schools/${this.tenant.id}/courses/${courseId}`).ref;

    batch.update(courseRef, {
      totalDuration: firebase.firestore.FieldValue.increment(-1 * videoDuration)
    });

    return from(batch.commit());
  }

  private findLastLessonInSection(courseId:string, sectionId:string): Observable<Lesson> {

    const query$ = this.afs.collection<Lesson>(this.lessonsPath(courseId), ref => ref.where('sectionId', '==', sectionId).orderBy('seqNo', 'desc').limit(1));

    return findUniqueMatchWithId(query$).pipe(first());
  }


  suscribeToLesson(courseId: string, lessonId:string): Observable<Lesson> {
    return readDocumentWithId(this.afs.doc(this.lessonsPath(courseId) + '/' + lessonId));
  }


  private sectionsPath(courseId:string) {
    return this.tenant.path(`courses/${courseId}/sections`);
  }

  private lessonsPath(courseId:string) {
    return this.tenant.path(`courses/${courseId}/lessons`);
  }


  updateLessons(courseId:string, changes: Update<Lesson>[]) {

    const batch = this.afs.firestore.batch();

    changes.forEach(change => {
      const lessonRef = this.afs.doc(`schools/${this.tenant.id}/courses/${courseId}/lessons/${change.id}`).ref;
      batch.update(lessonRef, change.changes);
    });

    return from(batch.commit());

  }
}




