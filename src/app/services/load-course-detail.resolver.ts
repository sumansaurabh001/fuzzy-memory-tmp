import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs';
import { courseLoaded, loadCourseDetail} from '../store/course.actions';
import {filter, first, map, tap} from 'rxjs/operators';
import {selectAllCourses} from '../store/selectors';
import {select, Store} from '@ngrx/store';
import {DescriptionsDbService} from './descriptions-db.service';
import {LoadingService} from './loading.service';
import {AppState} from '../store';
import {CoursesDBService} from './courses-db.service';



@Injectable()
export class LoadCourseDetailResolver implements Resolve<Course> {


  constructor(
    private coursesDB: CoursesDBService,
    private descriptionsDB: DescriptionsDbService,
    private router: Router,
    private store: Store<AppState>,
    private loading: LoadingService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Course> {

    const courseUrl = route.paramMap.get('courseUrl');

    return this.store
      .pipe(
        select(selectAllCourses),
        tap(courses => {

          const course = this.findCourseByUrl(courses, courseUrl);

          // if course is not loaded, load it before continuing
          if (course) {
            this.store.dispatch(loadCourseDetail({courseId: course.id}));
          }
          else {
            this.loading.showLoader(this.coursesDB.findCourseByUrl(courseUrl))
              .pipe(
                tap(course => this.store.dispatch(courseLoaded({course})))
              )
              .subscribe();
          }

        }),
        map(courses => this.findCourseByUrl(courses, courseUrl)),
        filter(course => !!course),
        first()
      );

  }

  private findCourseByUrl(courses:Course[], url:string) {
    return courses.find(course => course.url == url);

  }




}
