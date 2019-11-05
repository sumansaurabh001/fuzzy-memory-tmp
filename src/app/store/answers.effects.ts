import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {LoadingService} from '../services/loading.service';
import {select, Store} from '@ngrx/store';
import {AppState} from './index';
import {AnswersDbService} from '../services/answers-db.service';
import {LessonActions, AnswerActions} from './action-types';
import {concatMap, map, withLatestFrom} from 'rxjs/operators';
import {selectActiveCourse} from './selectors';
import {answersLoaded} from './answers.actions';


@Injectable({
  providedIn: "root"
})
export class AnswersEffects {

  loadAnswers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnswerActions.loadAnswers),
      concatMap(action => this.loading.showLoaderUntilCompleted(this.answersDB.loadAnswers(action.courseId, action.lessonId, action.questionId))),
      map(answers => answersLoaded({answers}))
    )
  );

  addNewAnswer$ = createEffect( () =>
      this.actions$.pipe(
        ofType(AnswerActions.addNewAnswer),
        concatMap(action => this.answersDB.createNewAnswer(action.answer.courseId, action.answer.questionId, action.answer.id, action.answer))
      )
    , {dispatch: false});

  deleteAnswer$ = createEffect( () =>
      this.actions$.pipe(
        ofType(AnswerActions.deleteAnswer),
        concatMap(action => this.answersDB.deleteAnswer(action.courseId, action.questionId, action.answerId))
      )
    , {dispatch: false});

  editAnswer$ = createEffect( () =>
      this.actions$.pipe(
        ofType(AnswerActions.editAnswer),
        concatMap(action => this.answersDB.updateAnswer(action.courseId, action.questionId, action.update))
      )
    , {dispatch: false});

  constructor(private actions$: Actions,
              private loading: LoadingService,
              private store: Store<AppState>,
              private answersDB: AnswersDbService) {




  }

}
