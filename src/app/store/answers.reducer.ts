import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {Answer, compareAnswers} from '../models/answer.model';
import {createReducer, on} from '@ngrx/store';
import {AnswerActions, QuestionsActions} from './action-types';
import {LessonQuestion} from '../models/lesson-question.model';


export interface AnswersState extends EntityState<Answer> {


}

const adapter = createEntityAdapter<Answer>({
  sortComparer: compareAnswers
});

const initialAnswerState = adapter.getInitialState();


export const answersReducer = createReducer(

  initialAnswerState,

  on(AnswerActions.addNewAnswer, (state, action) => adapter.addOne(action.answer, state)),

  on(AnswerActions.answersLoaded, (state, action) => adapter.addMany(action.answers, state)),

  on(AnswerActions.deleteAnswer, (state, action) => adapter.removeOne(action.answerId, state)),

  on(AnswerActions.editAnswer, (state, action) => adapter.updateOne(action.update, state))

);




export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
