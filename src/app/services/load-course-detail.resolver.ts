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

          let course = this.findCourse(courses, courseUrl);

          // load the course details (sections, lessons, descriptions, etc.)
          if (course) {
            this.store.dispatch(loadCourseDetail({courseId: course.id}));
          }
          // if the course is not loaded then load it here
          else {

            const seqNo = parseInt(courseUrl);

            // we can find the course either by sequence number or by custom url
            const course$ = isNaN(seqNo) ? this.coursesDB.findCourseByUrl(courseUrl) : this.coursesDB.findCourseBySeqNo(seqNo);

            this.loading.showLoader(course$)
              .pipe(
                tap(course => this.store.dispatch(courseLoaded({course})))
              )
              .subscribe();
          }

        }),
        map(courses => this.findCourse(courses, courseUrl)),
        filter(course => !!course),
        first()
      );
  }

  findCourse(courses: Course[], urlSegment:string) {

    const seqNo = parseInt(urlSegment);

    let course: Course;

    if (isNaN(seqNo)) {
      course = this.findCourseByUrl(courses, urlSegment);
    }
    else {
      course = this.findCourseBySeqNo(courses, seqNo);
    }

    return course;

  }

  findCourseByUrl(courses:Course[], url:string) {
    return courses.find(course => course.url == url);
  }

  findCourseBySeqNo(courses:Course[], seqNo:number) {
    return courses.find(course => course.seqNo == seqNo);
  }

}
