import {createAction, props} from '@ngrx/store';
import {Answer} from '../models/answer.model';


export const loadAnswers = createAction(
  "[Lesson Questions List] Load Answers",
  props<{courseId:string, lessonId:string}>()
);

export const answersLoaded = createAction(
  "[Lesson Questions List] Answers Loaded",
  props<{answers: Answer[]}>()
)


export const addNewAnswer = createAction(
  "[Add Answer] Add New Answer Dialog",
  props<{answer: Answer}>()
);


export const editAnswer = createAction(
  "[Edit Answer] Edit Answer Dialog"
);
