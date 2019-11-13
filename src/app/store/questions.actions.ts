import {createAction, props} from '@ngrx/store';
import {LessonQuestion} from '../models/lesson-question.model';
import {Update} from '@ngrx/entity';


export const loadLessonQuestionsPage = createAction(
  "[Lesson Questions List] Load Lesson Questions Page",
  props<{courseId:string, lessonId:string, lastTimestampLoaded:number}>()
);

export const lessonQuestionsPageLoaded = createAction(
  "[Question Effect] Lesson Questions Page Loaded",
  props<{lessonId:string, questions: LessonQuestion[]}>()
);

export const loadCourseQuestionsPage = createAction(
  "[Lesson Questions List] Load Course Questions Page",
  props<{courseId:string, lastTimestampLoaded:number}>()
);

export const courseQuestionsPageLoaded = createAction(
  "[Lessons Question List] Course Questions Page Loaded",
  props<{courseId:string, questions: LessonQuestion[]}>()
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



