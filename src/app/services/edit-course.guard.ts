import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {EditCourse, LoadCourse} from '../store/course.actions';
import {filter, first, map, tap} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {CoursesDBService} from './courses-db.service';
import {State} from '../store';
import {selectAllCoursesAndDescriptions} from '../store/selectors';
import {LoadCourseDescription} from '../store/description.actions';
import {Course} from '../models/course.model';


@Injectable()
export class EditCourseGuard implements CanActivate {

  constructor(private coursesDB: CoursesDBService,
              private router: Router,
              private store: Store<State>) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    const courseUrl = route.paramMap.get('courseUrl');

     return this.store
      .pipe(
        select(selectAllCoursesAndDescriptions),
        tap( selection => {

          const course = this.findCourseByUrl(<any>selection[0], courseUrl),
                descriptions = <Object> selection[1];

          if (!course) {
            this.store.dispatch(new LoadCourse({courseUrl}));
          }
          else {
            this.store.dispatch(new EditCourse({editedCourseId: course.id}));
          }

          if (course && !descriptions[course.id]) {
            this.store.dispatch(new LoadCourseDescription({courseId: course.id}));
          }

        }),
        map(selection => !!this.findCourseByUrl(<any>selection[0], courseUrl)),
        filter(course => !!course),
        first()
      );
  }

  private findCourseByUrl(courses:Course[], url:string) {
    return courses.find(course => course.url === url);

  }

}

