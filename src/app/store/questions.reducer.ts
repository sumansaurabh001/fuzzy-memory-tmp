import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {compareQuestions, LessonQuestion} from '../models/lesson-question.model';
import {createReducer, on} from '@ngrx/store';
import {AnswerActions, QuestionsActions} from './action-types';


export interface QuestionsState extends EntityState<LessonQuestion> {
  lastPageLoaded: number;
  allPagesLoaded: boolean;
}

const adapter: EntityAdapter<LessonQuestion> = createEntityAdapter<LessonQuestion>({
  sortComparer: compareQuestions
});

export const initialQuestionsState: QuestionsState = adapter.getInitialState({
  allPagesLoaded: false,
  lastPageLoaded: null
});


export const questionsReducer = createReducer(
  initialQuestionsState,

  on(QuestionsActions.addNewQuestion, (state, action) => adapter.addOne(<LessonQuestion>{
    id: action.questionId,
    courseId: action.courseId,
    ...action.props
  }, state)),

  on(QuestionsActions.lessonQuestionsLoaded, (state, action) => adapter.addMany(action.questions, state)),

  on(QuestionsActions.deleteQuestion, (state, action) => adapter.removeOne(action.questionId, state)),

  on(QuestionsActions.editQuestion, (state, action) => adapter.updateOne(action.update, state)),

  on(AnswerActions.addNewAnswer, (state, action) => {
      const question = state.entities[action.answer.questionId];
      return adapter.updateOne(
        {
          id: action.answer.questionId,
          changes: {
            repliesCount: question.repliesCount + 1
          }
        },
        state);
    }),
  on(AnswerActions.deleteAnswer, (state, action) => {
    const question = state.entities[action.questionId];
    return adapter.updateOne(
      {
        id: action.questionId,
        changes: {
          repliesCount: question.repliesCount - 1
        }
      },
      state);
  })
);


export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
