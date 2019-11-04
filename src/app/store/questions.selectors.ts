import {createFeatureSelector, createSelector} from '@ngrx/store';
import {QuestionsState} from './questions.reducer';

import * as fromQuestions from "./questions.reducer";
import {selectActiveLesson} from './selectors';


export const selectQuestionsState = createFeatureSelector<QuestionsState>("questions");

export const selectAllQuestions = createSelector(
  selectQuestionsState,
  fromQuestions.selectAll
)

export const selectActiveLessonQuestions = createSelector(
  selectAllQuestions,
  selectActiveLesson,
  (questions, lesson) => questions.filter(question => question.lessonId == lesson.id)

)
