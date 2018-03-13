import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {AddCourse, CourseActionTypes, DeleteCourse, FetchAllDbCourses, LoadCourses} from '../actions/course.actions';
import {concatMap, catchError, tap, map} from 'rxjs/operators';
import {CoursesDBService} from '../services/courses-db.service';
import {LoadingService} from '../services/loading.service';
import {MessagesService} from '../services/messages.service';
import {of} from 'rxjs/observable/of';
import {_throw} from 'rxjs/observable/throw';
import {Router} from '@angular/router';


@Injectable()
export class CourseEffects {

  @Effect() addCourse$ = this.actions$.pipe(
    ofType<AddCourse>(CourseActionTypes.FetchAllDbCourses),
    concatMap(() => this.loading.showLoader(this.coursesDB.findAllCourses())),
    map(courses => new LoadCourses({courses})),
    catchError(err => {
      this.messages.error(err);
      return _throw(err);
    })

  );

  @Effect({dispatch: false}) deleteCourse$ = this.actions$.pipe(
    ofType<DeleteCourse>(CourseActionTypes.DeleteCourse),
    concatMap(action => this.loading.showLoader(this.coursesDB.deleteCourseDraft(action.payload.id))),
    tap(() => this.router.navigateByUrl('/')),
    catchError(err => {
      this.messages.error('Could not delete the course draft', err);
      return _throw(err);
    })
  );

  // Should be your last effect
  @Effect() init$ = of(new FetchAllDbCourses());

  constructor(private actions$: Actions,
              private coursesDB: CoursesDBService,
              private loading: LoadingService,
              private messages: MessagesService,
              private router: Router) {


  }


}
