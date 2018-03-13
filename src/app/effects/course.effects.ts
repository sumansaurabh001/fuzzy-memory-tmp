import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {AddCourse, CourseActionTypes, FetchAllDbCourses, LoadCourses} from '../actions/course.actions';
import {concatMap, catchError, tap, map} from 'rxjs/operators';
import {CoursesDBService} from '../services/courses-db.service';
import {LoadingService} from '../services/loading.service';
import {MessagesService} from '../services/messages.service';
import {of} from 'rxjs/observable/of';


@Injectable()
export class CourseEffects {

  @Effect() addCourse$ = this.actions$.pipe(
    ofType<AddCourse>(CourseActionTypes.FetchAllDbCourses),
    concatMap(() => this.loading.showLoader(this.coursesDB.findAllCourses())),
    map(courses => new LoadCourses({courses}))
  );

  // Should be your last effect
  @Effect() init$ = of(new FetchAllDbCourses());

  constructor(private actions$: Actions,
              private coursesDB: CoursesDBService,
              private loading: LoadingService,
              private messages: MessagesService) {


  }


}
