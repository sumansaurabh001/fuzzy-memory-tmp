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


  createNewQuestion(courseId:string, props: Partial<LessonQuestion>) {

    console.log("Adding question to path: " + this.questionsPath(courseId));

    const addQuestionAsync = this.afs.collection(this.questionsPath(courseId)).add(props);

    return from(addQuestionAsync)
      .pipe(
        map(() => {
          return {
            ...props
          };
        })
      );

  }


  questionsPath(courseId:string) {
    return this.tenant.path(`courses/${courseId}/questions`);
  }



}
