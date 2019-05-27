import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {UserLessonStatus} from '../models/user-lesson-status';
import {TenantService} from './tenant.service';
import {Observable} from 'rxjs/Observable';
import {from} from 'rxjs';
import {readCollectionWithIds} from '../common/firestore-utils';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserLessonStatusDbService {


  constructor(
    private afs: AngularFirestore,
    private tenant: TenantService) {

  }

  loadLessonsWatchedByCourse(userId:string, courseId:string): Observable<UserLessonStatus[]> {

    const lessonsStatusListPath = `schools/${this.tenant.id}/users/${userId}/lessonsWatchedPerCourse/${courseId}/lessonsWatched`;

    const lessonsStatusList$ = this.afs.collection(lessonsStatusListPath);

    return readCollectionWithIds(lessonsStatusList$)
      .pipe(
        map((lessonStatusList:UserLessonStatus[]) => lessonStatusList.map(lessonStatus => {return {...lessonStatus, courseId}}))
      )
  }


  saveLessonStatus(userId:string, lessonStatus: UserLessonStatus):Observable<any> {

    const lessonStatusPath = `schools/${this.tenant.id}/users/${userId}/lessonsWatchedPerCourse/${lessonStatus.courseId}/lessonsWatched/${lessonStatus.id}`;

    if (lessonStatus.watched) {
      return from(this.afs.doc(lessonStatusPath).set({
        watched:true
      }));
    }
    else {
      return from(this.afs.doc(lessonStatusPath).delete());
    }
  }


}
