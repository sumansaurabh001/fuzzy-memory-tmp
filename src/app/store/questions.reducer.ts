import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {compareQuestions, LessonQuestion} from '../models/lesson-question.model';
import {createReducer, on} from '@ngrx/store';
import {AnswerActions, QuestionsActions} from './action-types';
import {PaginationInfo} from '../models/pagination-info.model';



export interface QuestionsState extends EntityState<LessonQuestion> {
  lessonQuestionsPagination: {[key: string]: PaginationInfo};
  courseQuestionsPagination: {[key: string]: PaginationInfo};
}

const adapter: EntityAdapter<LessonQuestion> = createEntityAdapter<LessonQuestion>({
  sortComparer: compareQuestions
});

export const initialQuestionsState: QuestionsState = adapter.getInitialState({
  lessonQuestionsPagination: {},
  courseQuestionsPagination: {}
});


export const questionsReducer = createReducer(

  initialQuestionsState,

  on(QuestionsActions.addNewQuestion, (state, action) => adapter.addOne(<LessonQuestion>{
    id: action.questionId,
    courseId: action.courseId,
    ...action.props
  }, state)),

  on(QuestionsActions.lessonQuestionsPageLoaded, (state, action) => {

    const lessonQuestionsPagination = {...state.lessonQuestionsPagination};
    lessonQuestionsPagination[action.lessonId] = {...lessonQuestionsPagination[action.lessonId]};

    const lastTimestamp = action.questions.length > 0 ? action.questions[action.questions.length - 1].createdAt.toMillis() : 0;

    if (!lessonQuestionsPagination[action.lessonId]) {
      lessonQuestionsPagination[action.lessonId] = {
        allPagesLoaded: false,
        lastTimestamp
      }
    }
    else if(action.questions.length > 0) {
      lessonQuestionsPagination[action.lessonId].lastTimestamp = lastTimestamp;
    }
    else {
      lessonQuestionsPagination[action.lessonId].allPagesLoaded = true;
    }

    return adapter.addMany(action.questions, {
      ...state,
      lessonQuestionsPagination
    });
  }),

  on(QuestionsActions.courseQuestionsPageLoaded, (state, action) => {

    const courseQuestionsPagination = {...state.courseQuestionsPagination};
    courseQuestionsPagination[action.courseId] = {...courseQuestionsPagination[action.courseId]};

    const lastTimestamp = action.questions.length > 0 ? action.questions[action.questions.length - 1].createdAt.toMillis() : 0;

    if (!courseQuestionsPagination[action.courseId]) {
      courseQuestionsPagination[action.courseId] = {
        allPagesLoaded: false,
        lastTimestamp
      }
    }
    else if(action.questions.length > 0) {
      courseQuestionsPagination[action.courseId].lastTimestamp = lastTimestamp;
    }
    else {
      courseQuestionsPagination[action.courseId].allPagesLoaded = true;
    }

    return adapter.addMany(action.questions, {
      ...state,
       courseQuestionsPagination
    });

  }),

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
