import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {tap} from 'rxjs/operators';
import {Course} from '../models/course.model';
import {CoursesDBService} from './courses-db.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {of} from 'rxjs/observable/of';


@Injectable()
export class CoursesService {

  private subject = new BehaviorSubject<Course[]>([]);

  courses$: Observable<Course[]> = this.subject.asObservable();


  constructor(private coursesDB: CoursesDBService) {}


  createNewCourse(course: Course): Observable<Course> {
    return this.coursesDB.createNewCourse(course)
      .pipe(
        tap(course => this.addAndEmit(course))
      );
  }


  findCourseByUrl(courseUrl: string): Observable<Course> | null {

    const course = this.subject.value.find(course => course.url == courseUrl);

    if (course) {
      return of(course);
    }

    return this.coursesDB.findCourseByUrl(courseUrl)
      .pipe(
        tap(course => this.addAndEmit(course))
      );
  }


  deleteCourseDraft(courseId: string): Observable<any> {
    return this.coursesDB.deleteCourseDraft(courseId)
      .pipe(
        tap(() => this.subject.next(this.subject.value.filter(course => course.id !== courseId)))
      );
  }


  private addAndEmit(course: Course) {
    return this.subject.next([...this.subject.value.slice(0), course]);
  }


}




