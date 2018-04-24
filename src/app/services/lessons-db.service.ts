import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {TenantService} from './tenant.service';
import {CourseSection} from '../models/course-section.model';
import {findLastBySeqNo, findUniqueMatchWithId, readCollectionWithIds, readDocumentWithId} from '../common/firestore-utils';
import {concatMap, first, map} from 'rxjs/operators';
import {Lesson} from '../models/lesson.model';
import {Course} from '../models/course.model';
import {fromPromise} from 'rxjs/observable/fromPromise';
import {Update} from '@ngrx/entity';
import {UpdateStr} from '@ngrx/entity/src/models';


@Injectable()
export class LessonsDBService {

  constructor(private afs: AngularFirestore,
              private tenant: TenantService) {

  }


  loadCourseSections(courseId: string): Observable<CourseSection[]> {

    const coursePath = this.tenant.path(`courses/${courseId}`);

    return readCollectionWithIds<CourseSection[]>(this.afs.collection(coursePath + '/sections', ref => ref.orderBy('seqNo')))
      .map(sections => sections.map(section => {return {...section, courseId}}));

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

          return fromPromise(addSectionAsync);
        })
      );
  }

  saveSection(courseId: string, sectionId:string, update: UpdateStr<CourseSection>): Observable<any> {
    return fromPromise(this.afs.collection(this.sectionsPath(courseId)).doc(update.id).update(update.changes));
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

          return fromPromise(addLessonAsync);
        })
      );
  }

  saveLesson(courseId: string, update: UpdateStr<Lesson>): Observable<any> {
    return fromPromise(this.afs.collection(this.lessonsPath(courseId)).doc(update.id).update(update.changes));
  }

  deleteSection(courseId: string, sectionId: string): Observable<any> {
    return fromPromise(this.afs.collection(this.sectionsPath(courseId)).doc(sectionId).delete());
  }

  deleteLesson(courseId: string, lessonId:string): Observable<any> {
    return fromPromise(this.afs.collection(this.lessonsPath(courseId)).doc(lessonId).delete());
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


}




