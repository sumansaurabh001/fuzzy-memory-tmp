import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {TenantService} from './tenant.service';
import {CourseSection} from '../models/course-section.model';
import {findLastBySeqNo, findUniqueMatchWithId, readCollectionWithIds} from '../common/firestore-utils';
import {concatMap, first, map} from 'rxjs/operators';
import {Lesson} from '../models/lesson.model';
import {Course} from '../models/course.model';
import {fromPromise} from 'rxjs/observable/fromPromise';


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


  addNewSection(course: Course, title: string):Observable<CourseSection> {
    return findLastBySeqNo<CourseSection>(this.afs, this.sectionsPath(course))
      .pipe(
        concatMap(last => {

          const newSection: any = {
            title,
            seqNo: last ? (last.seqNo + 1) : 1
          };

          const addSectionAsync = this.afs.collection(this.sectionsPath(course))
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


  addNewLesson(course: Course, section: CourseSection, title: string): Observable<Lesson> {
    return this.findLastLessonInSection(course, section)
      .pipe(
        concatMap(last => {

          const newLesson: any = {
            title,
            seqNo: last ? (last.seqNo + 1) : 1,
            sectionId: section.id
          };

          const addLessonAsync = this.afs.collection(this.lessonsPath(course))
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


  deleteSection(course: Course, section: CourseSection): Observable<any> {
    return fromPromise(this.afs.collection(this.sectionsPath(course)).doc(section.id).delete());
  }


  private findLastLessonInSection(course:Course, section:CourseSection): Observable<Lesson> {

    const query$ = this.afs.collection<Lesson>(this.lessonsPath(course), ref => ref.where('sectionId', '==', section.id).orderBy('seqNo', 'desc').limit(1));

    return findUniqueMatchWithId(query$).pipe(first());
  }


  private sectionsPath(course:Course) {
    return this.tenant.path(`courses/${course.id}/sections`);
  }

  private lessonsPath(course:Course) {
    return this.tenant.path(`courses/${course.id}/lessons`);
  }


}




