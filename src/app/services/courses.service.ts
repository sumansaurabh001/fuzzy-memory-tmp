import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {map, switchMap, tap} from 'rxjs/operators';
import {Course} from '../models/course.model';
import {CoursesDBService} from './courses-db.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {MessagesService} from './messages.service';


@Injectable()
export class CoursesService {

  private subject = new BehaviorSubject<Course[]>([]);

  courses$: Observable<Course[]> = this.subject.asObservable();


  constructor(private coursesDB: CoursesDBService,
              private messages: MessagesService) {

    this.reloadAllCourses();

  }


  reloadAllCourses() {
    this.coursesDB.findAllCourses()
      .subscribe(
        courses => this.subject.next(courses),
        err => this.messages.error('Could not load courses.', err));
  }

  createNewCourse(course: Course): Observable<Course> {
    return this.coursesDB.createNewCourse(course)
      .pipe(
        tap(course => this.addAndEmit(course))
      );
  }


  findCourseByUrl(courseUrl: string): Observable<Course> {

    const loaded = this.subject.value.find(course => course.url == courseUrl);

    const course$ = this.courses$
      .pipe(
        map(courses => courses.find(course => course.url == courseUrl))
      );

    if (loaded) {
      return course$;
    }
    else {
      return this.coursesDB.findCourseByUrl(courseUrl)
        .pipe(
          tap(course => this.addAndEmit(course)),
          switchMap(() => course$)
        );

    }
  }


  deleteCourseDraft(courseId: string): Observable<any> {
    return this.coursesDB.deleteCourseDraft(courseId)
      .pipe(
        tap(() => this.subject.next(this.subject.value.filter(course => course.id !== courseId)))
      );
  }

  updateCourse(course: Course, props: Partial<Course>) {
    return this.coursesDB.updateCourse(course, props)
      .pipe(
        tap(updated => this.updateAndEmit(updated))
      );

  }


  private addAndEmit(course: Course) {
    this.subject.next([...this.subject.value.slice(0), course]);
  }


  private updateAndEmit(course: Course) {

    const courses = this.subject.value.slice(0);

    const courseIndex = courses.findIndex(el => el.id == course.id);

    if (courseIndex >= 0) {
      courses[courseIndex] = course;
      this.subject.next(courses);
    }
  }


}




