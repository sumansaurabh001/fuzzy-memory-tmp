import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {TenantService} from './tenant.service';
import {readCollectionWithIds} from '../common/firestore-utils';
import {LessonQuestion} from '../models/lesson-question.model';
import {first, map} from 'rxjs/operators';
import {from} from 'rxjs/internal/observable/from';
import {Update} from '@ngrx/entity';
import {Answer} from '../models/answer.model';
import * as firebase from 'firebase/app';


@Injectable({
  providedIn: "root"
})
export class AnswersDbService {

  constructor(
    private afs: AngularFirestore,
    private tenant:TenantService) {

  }


  loadAnswers(courseId:string, lessonId:string, questionId:string) {

    const answersPath = this.answersPath(courseId, questionId);

    return readCollectionWithIds<Answer[]>(this.afs.collection(answersPath, ref => ref.where("lessonId", "==", lessonId)))
      .pipe(
        first(),
        map(lessons => lessons.map(lesson => {return {...lesson, courseId, lessonId}}))
      );
  }


  createNewAnswer(courseId:string, questionId:string, answerId:string, props: Partial<Answer>) {

    const questionPath = this.questionsPath(courseId) + `/${questionId}`;

    const answersPath = this.answersPath(courseId, questionId);

    const batch = this.afs.firestore.batch();

    const questionRef = this.afs.doc(questionPath).ref;

    batch.update(questionRef, {
      repliesCount: firebase.firestore.FieldValue.increment(1)
    });

    const answerRef = this.afs.doc(answersPath + `/${answerId}`).ref;

    batch.set(answerRef, props);

    return batch.commit()
      .then(() => {return {
        id: answerId,
        courseId,
        ...props
      }});
  }

  questionsPath(courseId:string) {
    return this.tenant.path(`courses/${courseId}/questions`);
  }

  answersPath(courseId:string, questionId:string) {
    return this.tenant.path(`courses/${courseId}/questions/${questionId}/answers`);
  }


  deleteAnswer(courseId: any, questionId: string, answerId:string) {

    const questionPath = this.questionsPath(courseId) + `/${questionId}`;

    const answerPath = this.answersPath(courseId, questionId) + `/${answerId}`;

    const batch = this.afs.firestore.batch();

    const answerRef = this.afs.doc(answerPath).ref;

    batch.delete(answerRef);

    const questionRef = this.afs.doc(questionPath).ref;

    batch.update(questionRef, {
      repliesCount: firebase.firestore.FieldValue.increment(-1)
    });

    return batch.commit();
  }


  updateAnswer(courseId:string, questionId:string, update: Update<LessonQuestion>) {
    return from(this.afs.collection(this.answersPath(courseId, questionId)).doc('' + update.id).update(update.changes));
  }


}
