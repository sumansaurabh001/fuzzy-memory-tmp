import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {TenantService} from './tenant.service';
import {Question} from '../models/question.model';
import {from} from 'rxjs/internal/observable/from';
import {map} from 'rxjs/operators';
import {LessonQuestion} from '../models/lesson-question.model';


@Injectable({
  providedIn: "root"
})
export class QuestionsDbService {

  constructor(
    private afs: AngularFirestore,
    private tenant:TenantService) {

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
