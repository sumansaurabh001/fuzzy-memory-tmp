import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {AddCourse, EditCourse, LoadCourse} from '../store/course.actions';
import {filter, first, map, tap} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {CoursesDBService} from './courses-db.service';
import {State} from '../store';
import {selectAllCourses, selectCourseEntities} from '../store/selectors';
import {Course} from '../models/course.model';
import {LoadingService} from './loading.service';
import {DescriptionsDbService} from './descriptions-db.service';
import {AddDescription} from '../store/description.actions';


@Injectable()
export class EditCourseGuard implements CanActivate {

  constructor(
    private coursesDB: CoursesDBService,
    private descriptionsDB: DescriptionsDbService,
    private router: Router,
    private store: Store<State>,
    private loading: LoadingService) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    const courseUrl = route.paramMap.get('courseUrl');

     return this.store
      .pipe(
        select(selectAllCourses),
        tap( courses => {

          const course = this.findCourseByUrl(courses, courseUrl);

          // load the course before finishing the route transition
          if (!course) {
            this.loadCourse(courseUrl);
          }
          else {
            // don't wait for the description to be loaded
            this.loadCourseDescription(course.id);
            this.store.dispatch(new EditCourse({editedCourseId: course.id}));
          }

        }),
        map(courses => !!this.findCourseByUrl(courses, courseUrl)),
        filter(course => !!course),
        first()
      );
  }

  private loadCourse(courseUrl:string) {
    this.loading.showLoader(this.coursesDB.findCourseByUrl(courseUrl))
      .pipe(
        tap(course => this.store.dispatch(new AddCourse({course})))
      )
      .subscribe();
  }

  private loadCourseDescription(courseId:string) {
    this.loading.showLoader(this.descriptionsDB.findCourseDescription(courseId))
      .pipe(
        tap(description => this.store.dispatch(new AddDescription({id:courseId, description})) )
      )
      .subscribe();
  }

  private findCourseByUrl(courses:Course[], url:string) {
    return courses.find(course => course.url === url);

  }

}

