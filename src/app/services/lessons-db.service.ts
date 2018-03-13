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


  loadCourseSectionsWithLessons(courseId: string): Observable<CourseSection[]> {

    const coursePath = this.tenant.path(`courses/${courseId}`);

    const courseSections$ = readCollectionWithIds<CourseSection[]>(this.afs.collection(coursePath + '/sections', ref => ref.orderBy('seqNo')));

    const courseLessons$ = readCollectionWithIds<Lesson[]>(this.afs.collection(coursePath + '/lessons', ref => ref.orderBy('seqNo')));

    return courseSections$.pipe(
      concatMap(
        () => courseLessons$,
        (sections: CourseSection[], lessons) => {

          const lessonsPerSection = lessons.reduce((result, lesson) => result[lesson.sectionId] = lesson, {});

          return sections.map(section => {
            section.lessons = lessonsPerSection[section.id];
            return section;

          });

        })
    );
  }


  addNewCourseSection(course: Course, title: string):Observable<CourseSection> {
    return findLastBySeqNo<CourseSection>(this.afs, this.sectionsPath(course))
      .pipe(
        concatMap(lastSection => {

          const newSection: any = {
            title,
            seqNo: lastSection ? (lastSection.seqNo + 1) : 1
          };

          const addSectionAsync = this.afs.collection(this.sectionsPath(course))
            .add(newSection)
            .then(ref => {return {id:ref.id, ...newSection}});

          return fromPromise(addSectionAsync);
        })
      );
  }





  private sectionsPath(course:Course) {
    return this.tenant.path(`courses/${course.id}/sections`);
  }


}




