import {createAction, props} from '@ngrx/store';
import {LessonQuestion} from '../models/lesson-question.model';
import {Update} from '@ngrx/entity';


export const loadLessonQuestions = createAction(
  "[Lesson Questions List] Load Lesson Questions",
  props<{courseId:string, lessonId:string}>()
);

export const lessonQuestionsLoaded = createAction(
  "[Question Effect] Lesson Questions Loaded",
  props<{questions: LessonQuestion[]}>()
);

export const addNewQuestion = createAction(
  "[Add Question Dialog] Add New Question",
  props<{courseId:string, questionId:string, props:Partial<LessonQuestion>}>()
);


export const editQuestion = createAction(
  "[Edit Question Dialog] Edit Question Dialog",
    props<{courseId:string, update: Update<LessonQuestion>}>()
);

export const deleteQuestion = createAction(
  "[Question Item] Delete Question",
  props<{courseId:string, questionId:string}>()
);



