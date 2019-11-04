import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {TenantService} from './tenant.service';
import {from} from 'rxjs/internal/observable/from';
import {first, map} from 'rxjs/operators';
import {LessonQuestion} from '../models/lesson-question.model';
import {readCollectionWithIds} from '../common/firestore-utils';



const QUESTIONS_PAGE_SIZE = 20;



@Injectable({
  providedIn: "root"
})
export class QuestionsDbService {

  constructor(
    private afs: AngularFirestore,
    private tenant:TenantService) {

  }

  loadLessonQuestions(courseId:string, lessonId:string, pageNumber = 0) {

    const questionsPath = this.questionsPath(courseId);

    return readCollectionWithIds<LessonQuestion[]>(this.afs.collection(questionsPath,
        ref => ref.where("lessonId", "==", lessonId)
          .limit(QUESTIONS_PAGE_SIZE)))
      .pipe(
        first(),
        map(lessons => lessons.map(lesson => {return {...lesson, courseId, lessonId}}))
      );

  }


  createNewQuestion(courseId:string, questionId:string, props: Partial<LessonQuestion>) {

    const questionPath = this.questionsPath(courseId) + `/${questionId}`;

    const addQuestionAsync = this.afs.doc(questionPath).set(props);

    return from(addQuestionAsync)
      .pipe(
        map(() => {
          return {
            id: questionId,
            courseId,
            ...props
          };
        })
      );

  }

  questionsPath(courseId:string) {
    return this.tenant.path(`courses/${courseId}/questions`);
  }


}
