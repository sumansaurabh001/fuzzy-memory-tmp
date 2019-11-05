import {createFeatureSelector, createSelector} from '@ngrx/store';
import {AnswersState} from './answers.reducer';

import * as fromAnswers from "./answers.reducer";

export const selectAnswersState = createFeatureSelector<AnswersState>("answers");

export const selectAllAnswers = createSelector(
  selectAnswersState,
  fromAnswers.selectAll
);



export const selectQuestionAnswers = (questionId:string) => createSelector(
  selectAllAnswers,
  answers => answers.filter(answer => answer.questionId == questionId)
);
