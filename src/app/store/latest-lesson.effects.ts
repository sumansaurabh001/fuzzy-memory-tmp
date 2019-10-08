import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {LatestLessonActions} from './action-types';
import {concatMap, map, withLatestFrom} from 'rxjs/operators';
import {LatestLessonsDbService} from '../services/latest-lessons-db.service';
import {latestLessonsPageLoaded} from './latest-lesson.actions';
import {AppState} from './index';
import {select, Store} from '@ngrx/store';
import {selectLatestLessonsState} from './latest-lessons.selectors';


@Injectable()
export class LatestLessonEffects {

  loadLatestLessons$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(LatestLessonActions.loadNextLatestLessonsPage),
        withLatestFrom(this.store.pipe(select(selectLatestLessonsState))),
        concatMap(([action, state]) =>
          this.latestLessonsDB.loadLatestLessonsPage(state.lastPageLoaded != null ? state.lastPageLoaded + 1 : 0)),
        map(latestLessons => latestLessonsPageLoaded({latestLessons})))

  );

  constructor(
    private actions$ : Actions,
    private latestLessonsDB: LatestLessonsDbService,
    private store: Store<AppState>) {

  }

}
