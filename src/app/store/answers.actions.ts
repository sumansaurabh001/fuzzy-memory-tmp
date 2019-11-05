import {createAction, props} from '@ngrx/store';
import {Answer} from '../models/answer.model';
import {Update} from '@ngrx/entity';


export const loadAnswers = createAction(
  "[Answers List] Load Answers",
  props<{courseId:string, lessonId:string, questionId:string}>()
);

export const answersLoaded = createAction(
  "[Lesson Questions List] Answers Loaded",
  props<{answers: Answer[]}>()
)


export const addNewAnswer = createAction(
  "[Add Answer Dialog] Add New Answer Dialog",
  props<{answer: Answer}>()
);


export const editAnswer = createAction(
  "[Edit Answer Dialog] Edit Answer Dialog",
  props<{courseId:string, lessonId:string, questionId:string, update: Update<Answer>}>()
);


export const deleteAnswer = createAction(
  "[Answers List] Delete Answer",
  props<{courseId:string, answerId:string, questionId:string}>()
);


