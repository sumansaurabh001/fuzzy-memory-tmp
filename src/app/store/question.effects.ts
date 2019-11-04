import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {LoadingService} from '../services/loading.service';
import {select, Store} from '@ngrx/store';
import {AppState} from './index';
import {LessonActions, QuestionsActions} from './action-types';
import {concatMap, map, withLatestFrom} from 'rxjs/operators';
import {QuestionsDbService} from '../services/questions-db.service';
import {selectActiveCourse} from './selectors';
import {lessonQuestionsLoaded} from './questions.actions';



@Injectable({
  providedIn: 'root'
})
export class QuestionEffects {

  loadLessonQuestions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LessonActions.watchLesson),
      withLatestFrom(this.store.pipe(select(selectActiveCourse))),
      concatMap(([action, course]) => this.questionsDB.loadLessonQuestions(course.id, action.lessonId)),
      map(questions => lessonQuestionsLoaded({questions}))
    )
  );

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
