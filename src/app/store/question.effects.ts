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
      ofType(QuestionsActions.loadLessonQuestions),
      withLatestFrom(this.store.pipe(select(selectActiveCourse))),
      concatMap(([action, course]) => this.questionsDB.loadLessonQuestions(course.id, action.lessonId)
        .pipe(
          map(questions => [action.lessonId, action.pageNumber, questions])
        )
      ),
      map(([lessonId, pageNumber, questions]:any) => lessonQuestionsLoaded({lessonId ,questions, pageNumber}))
    )
  );

  addNewQuestion$ = createEffect( () =>
    this.actions$.pipe(
      ofType(QuestionsActions.addNewQuestion),
      concatMap(action => this.questionsDB.createNewQuestion(action.courseId, action.questionId, action.props))
    )
  , {dispatch: false});


  deleteQuestion$ = createEffect( () =>
      this.actions$.pipe(
        ofType(QuestionsActions.deleteQuestion),
        concatMap(action => this.questionsDB.deleteQuestion(action.courseId, action.questionId))
      )
    , {dispatch: false});


  editQuestion$ = createEffect( () =>
      this.actions$.pipe(
        ofType(QuestionsActions.editQuestion),
        concatMap(action => this.questionsDB.updateQuestion(action.courseId, action.update))
      )
    , {dispatch: false});


  constructor(
    private actions$: Actions,
    private loading: LoadingService,
    private store: Store<AppState>,
    private questionsDB: QuestionsDbService) {

  }

}
