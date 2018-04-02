import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {AddCourse, LoadCourseDetail} from '../store/course.actions';
import {filter, first, map, tap} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {CoursesDBService} from './courses-db.service';
import {AppState} from '../store';
import {selectAllCourses} from '../store/selectors';
import {Course} from '../models/course.model';
import {LoadingService} from './loading.service';
import {DescriptionsDbService} from './descriptions-db.service';


@Injectable()
export class LoadCourseDetailGuard implements CanActivate {

  constructor(
    private coursesDB: CoursesDBService,
    private descriptionsDB: DescriptionsDbService,
    private router: Router,
    private store: Store<AppState>,
    private loading: LoadingService) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    const courseSeqNo = parseInt(route.paramMap.get('courseSeqNo'));

     return this.store
      .pipe(
        select(selectAllCourses),
        tap(courses => {

          const course = this.findCourseBySeqNo(courses, courseSeqNo);

          // if course is not loaded, load it before continuing
          if (course) {
            this.store.dispatch(new LoadCourseDetail({courseId: course.id}));
          }
          else {
            this.loading.showLoader(this.coursesDB.findCourseBySeqNo(courseSeqNo))
              .pipe(
                tap(course => this.store.dispatch(new AddCourse({course})))
              )
              .subscribe();
          }

        }),
        map(courseDetails => !!this.findCourseBySeqNo(courseDetails, courseSeqNo)),
        filter(isCourseLoaded => isCourseLoaded)
      );
  }

  private findCourseBySeqNo(courses:Course[], seqNo:number) {
    return courses.find(course => course.seqNo == seqNo);

  }

}

