import {Injectable} from '@angular/core';
import {Lesson} from '../models/lesson.model';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store';
import {watchLesson} from '../store/lesson.actions';
import {selectActiveCourse, selectActiveCourseAllLessons, selectActiveCourseSections} from '../store/selectors';
import {filter, first, map, tap, withLatestFrom} from 'rxjs/operators';
import {CourseSection} from '../models/course-section.model';
import {selectQuestionsPaginationInfo} from '../store/questions.selectors';
import {loadLessonQuestions} from '../store/questions.actions';


@Injectable()
export class ActiveLessonResolver implements Resolve<any> {

  constructor(private store: Store<AppState>) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

    const sectionSeqNo = parseInt(route.paramMap.get('sectionSeqNo')),
          lessonSeqNo = parseInt(route.paramMap.get('lessonSeqNo'));

    return this.store
      .pipe(
        select(selectActiveCourseAllLessons),
        withLatestFrom(this.store.pipe(select(selectActiveCourseSections))),
        map(([lessons, sections]) => {

          const activeSection = sections.find(section => section.seqNo == sectionSeqNo);

          const activeSectionLessons = lessons.filter(lesson => lesson.sectionId == activeSection.id);

          return activeSectionLessons.find(lesson => lesson.seqNo == lessonSeqNo);
        }),
        filter(lesson => !!lesson),
        tap(lesson => this.store.dispatch(watchLesson({lessonId: lesson.id}))),
        withLatestFrom(
          this.store.pipe(select(selectActiveCourse)),
          this.store.pipe(select(selectQuestionsPaginationInfo))
        ),
        tap(([lesson, course, paginationInfo]) => {
          // load the first page of lesson questions, but only if needed
          if (!paginationInfo[lesson.id]) {
            this.store.dispatch(loadLessonQuestions({lessonId: lesson.id, courseId: course.id, pageNumber: 0}));
          }
        }),
        first()
      );
  }


}
