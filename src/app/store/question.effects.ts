import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {LoadingService} from '../services/loading.service';
import {Store} from '@ngrx/store';
import {AppState} from './index';
import {QuestionsActions} from './action-types';
import {concatMap} from 'rxjs/operators';
import {QuestionsDbService} from '../services/questions-db.service';



@Injectable({
  providedIn: 'root'
})
export class QuestionEffects {

  saveQuestion$ = createEffect( () =>
    this.actions$.pipe(
      ofType(QuestionsActions.addNewQuestion),
      concatMap(action => this.questionsDB.createNewQuestion(action.courseId, action.questionId, action.props))
    )
  , {dispatch: false});

  constructor(
    private actions$: Actions,
    private loading: LoadingService,
    private store: Store<AppState>,
    private questionsDB: QuestionsDbService) {

  }

}
