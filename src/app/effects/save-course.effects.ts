import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {AddCourse, CourseActions, CourseActionTypes, SaveCourseDB} from '../actions/course.actions';
import {CoursesService} from '../services/courses.service';
import {MessagesService} from '../services/messages.service';
import {concatMap, map} from 'rxjs/operators';


@Injectable()
export class SaveCourseEffects {

  @Effect() newCourse$ = this.actions$
    .pipe(
      ofType<SaveCourseDB>(CourseActionTypes.SaveCourseDB),
      concatMap(action => this.coursesService.createNewCourse(action.payload)),
      map(course => new AddCourse({course}))
    );


  constructor(private actions$: Actions,
              private coursesService: CoursesService,
              private messagesService: MessagesService) {

  }

}


/*
   this.coursesService.createNewCourse(course)
      .subscribe(() => {
          this.router.navigate(['courses', course.url, 'edit']);
          this.dialogRef.close();
        },
        err => this.messages.error(err));

*/
