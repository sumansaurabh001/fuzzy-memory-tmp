import {Injectable} from '@angular/core';
import {AngularFirestore, QueryFn} from '@angular/fire/firestore';
import {TenantService} from './tenant.service';
import {from} from 'rxjs/internal/observable/from';
import {first, map} from 'rxjs/operators';
import {LessonQuestion} from '../models/lesson-question.model';
import {readCollectionWithIds} from '../common/firestore-utils';
import {Update} from '@ngrx/entity';
import * as firebase from "firebase/app";


const QUESTIONS_PAGE_SIZE = 2;



@Injectable({
  providedIn: "root"
})
export class QuestionsDbService {

  constructor(
    private afs: AngularFirestore,
    private tenant:TenantService) {

  }

  loadLessonQuestions(courseId:string, lessonId:string, startAfter: number) {

    const questionsPath = this.questionsPath(courseId);

    const queryFn: QueryFn = ref => {
      let query = ref.orderBy('createdAt', "desc")
        .where("lessonId", "==", lessonId)
        .limit(QUESTIONS_PAGE_SIZE);
      if (startAfter) {
        query = query.startAfter(firebase.firestore.Timestamp.fromMillis(startAfter));
      }
      return query;
    };

    return readCollectionWithIds<LessonQuestion[]>(this.afs.collection(questionsPath, queryFn)
    )
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


  deleteQuestion(courseId: any, questionId: string) {

    const questionPath = this.questionsPath(courseId) + `/${questionId}`;

    return from(this.afs.doc(questionPath).delete());
  }


  updateQuestion(courseId:string, update: Update<LessonQuestion>) {
    return from(this.afs.collection(this.questionsPath(courseId)).doc('' + update.id).update(update.changes));
  }


}

