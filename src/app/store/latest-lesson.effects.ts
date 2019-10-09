import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {LatestLessonActions} from './action-types';
import {concatMap, map, withLatestFrom} from 'rxjs/operators';
import {LatestLessonsDbService} from '../services/latest-lessons-db.service';
import {latestLessonsPageLoaded} from './latest-lesson.actions';
import {AppState} from './index';
import {select, Store} from '@ngrx/store';
import {selectLatestLessonsState} from './latest-lessons.selectors';
import {LoadingService} from '../services/loading.service';


@Injectable()
export class LatestLessonEffects {

  loadLatestLessons$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(LatestLessonActions.loadNextLatestLessonsPage),
        withLatestFrom(this.store.pipe(select(selectLatestLessonsState))),
        concatMap(([action, state]) =>
            this.loading.showLoaderUntilCompleted(
              this.latestLessonsDB.loadLatestLessonsPage(state.latestLessons.length ? state.latestLessons[state.latestLessons.length -1].lastUpdated : null)
            )
        ),
        map(latestLessons => latestLessonsPageLoaded({latestLessons})))

  );

  constructor(
    private actions$ : Actions,
    private latestLessonsDB: LatestLessonsDbService,
    private store: Store<AppState>,
    private loading: LoadingService) {

  }

}
