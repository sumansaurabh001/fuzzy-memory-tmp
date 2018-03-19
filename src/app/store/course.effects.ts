import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import { CourseActionTypes, DeleteCourse} from '../store/course.actions';
import {concatMap, catchError} from 'rxjs/operators';
import {CoursesDBService} from '../services/courses-db.service';
import {LoadingService} from '../services/loading.service';
import {MessagesService} from '../services/messages.service';
import {_throw} from 'rxjs/observable/throw';
import {Router} from '@angular/router';
import { UpdateCourse} from './course.actions';


@Injectable()
export class CourseEffects {


  @Effect({dispatch: false})
  deleteCourse$ = this.actions$
    .pipe(
      ofType<DeleteCourse>(CourseActionTypes.DeleteCourse),
      concatMap(action => this.loading.showLoader(this.coursesDB.deleteCourseDraft(action.payload.id))),
      catchError(err => {
        this.messages.error('Could not delete the course draft', err);
        return _throw(err);
      })
    );

  @Effect({dispatch:false})
  saveCourse$ = this.actions$
    .pipe(
      ofType<UpdateCourse>(CourseActionTypes.UpdateCourse),
      concatMap(action => this.loading.showLoader(this.coursesDB.saveCourse(action.payload.course.id, action.payload.course.changes))),
    );



  constructor(private actions$: Actions,
              private coursesDB: CoursesDBService,
              private loading: LoadingService,
              private messages: MessagesService) {

  }


}
