import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {AddCourse, EditCourse} from '../store/course.actions';
import {filter, first, map, tap} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {CoursesDBService} from './courses-db.service';
import {State} from '../store';
import {selectAllCourses} from '../store/selectors';
import {Course} from '../models/course.model';
import {LoadingService} from './loading.service';
import {DescriptionsDbService} from './descriptions-db.service';


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
        tap(() => this.store.dispatch(new EditCourse({courseUrl}))),
        map(courseDetails => !!this.findCourseByUrl(courseDetails, courseUrl)),
        filter(isCourseLoaded => isCourseLoaded)
      );
  }

  private findCourseByUrl(courses:Course[], url:string) {
    return courses.find(course => course.url === url);

  }

}

