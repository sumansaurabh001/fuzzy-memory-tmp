import {Injectable} from '@angular/core';
import {Lesson} from '../models/lesson.model';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store';
import {WatchLesson} from '../store/lesson.actions';
import {selectActiveCourseAllLessons, selectActiveCourseSections} from '../store/selectors';
import {filter, first, map, tap, withLatestFrom} from 'rxjs/operators';
import {CourseSection} from '../models/course-section.model';


@Injectable()
export class ActiveLessonResolver implements Resolve<Lesson> {

  constructor(private store: Store<AppState>) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Lesson> {

    const sectionSeqNo = parseInt(route.paramMap.get('sectionSeqNo')),
          lessonSeqNo = route.paramMap.get('lessonSeqNo');

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
        tap(lesson => this.store.dispatch(new WatchLesson({lessonId: lesson.id}))),
        first()
      );
  }


}
