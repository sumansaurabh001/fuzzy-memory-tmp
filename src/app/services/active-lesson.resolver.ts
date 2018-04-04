import {Injectable} from '@angular/core';
import {Lesson} from '../models/lesson.model';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store';
import {WatchLesson} from '../store/lesson.actions';
import {selectActiveCourseAllLessons} from '../store/selectors';
import {filter, first, map, tap} from 'rxjs/operators';


@Injectable()
export class ActiveLessonResolver implements Resolve<Lesson> {

  constructor(private store: Store<AppState>) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Lesson> {

    const lessonSeqNo = route.paramMap.get('lessonSeqNo');

    return this.store
      .pipe(
        select(selectActiveCourseAllLessons),
        map(lessons => lessons.find(lesson => lesson.seqNo == lessonSeqNo)),
        filter(lesson => !!lesson),
        tap(lesson => this.store.dispatch(new WatchLesson({lessonId: lesson.id}))),
        first(),
      );
  }


}
