import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {compareQuestions, LessonQuestion} from '../models/lesson-question.model';
import {createReducer} from '@ngrx/store';


export interface QuestionsState extends EntityState<LessonQuestion> {
  lastPageLoaded:number;
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

  initialQuestionsState

);



export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
