import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {filter, first, map, switchMap, tap} from 'rxjs/operators';
import {Course} from '../models/course.model';
import {CoursesDBService} from './courses-db.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {MessagesService} from './messages.service';
import {LoadingService} from './loading.service';

export type DescriptionsMap = {[key:string]:string};


@Injectable()
export class ApplicationStore {

  private coursesSub = new BehaviorSubject<Course[]>([]);
  private descriptionsSub = new BehaviorSubject<DescriptionsMap>({});

  courses$: Observable<Course[]> = this.coursesSub.asObservable();
  descriptions$ : Observable<DescriptionsMap> = this.descriptionsSub.asObservable();


  constructor(private coursesDB: CoursesDBService,
              private messages: MessagesService,
              private loading: LoadingService) {

    this.init();

  }

  private init() {

    this.loading.showLoader(this.coursesDB.findAllCourses())
      .pipe(
        first(),
        tap(courses => this.coursesSub.next(courses)),
        switchMap(() => this.courses$)
      )
      .subscribe(
        () => {
        },
        err => this.messages.error('Could not load courses', err)
      );
  }

  selectCourseById(id: string) {
    return this.courses$
      .pipe(
        map(courses => courses.find(course => course.id == id)),
        filter(course => !!course)
      );
  }

  selectCourseByUrl(url: string): Observable<Course> {
    return this.courses$
      .pipe(
        map(courses => courses.find(course => course.url == url)),
        filter(course => !!course)
      );
  }

  createNewCourse(course: Course): Observable<Course> {
    return this.loading.showLoader(this.coursesDB.createNewCourse(course))
      .pipe(
        tap(course => this.addCourseAndEmit(course))
      );
  }


  loadCourseWithUrl(courseUrl: string): Observable<Course> {

    const loaded = this.coursesSub.value.find(course => course.url == courseUrl);

    if (!loaded) {
      this.loading.showLoader(this.coursesDB.findCourseByUrl(courseUrl))
        .pipe(
          first(),
          tap(course => this.addCourseAndEmit(course))
        )
        .subscribe();
    }

    return this.selectCourseByUrl(courseUrl);
  }

  deleteCourseDraft(courseId: string): Observable<any> {
    return this.loading.showLoader(this.coursesDB.deleteCourseDraft(courseId))
      .pipe(
        tap(() => this.coursesSub.next(this.coursesSub.value.filter(course => course.id !== courseId)))
      );
  }

  updateCourse(course: Course, props: Partial<Course>) {
    return this.loading.showLoader(this.coursesDB.updateCourse(course, props))
      .pipe(
        tap(updated => this.updateCourseAndEmit(updated))
      );
  }

  private addCourseAndEmit(course: Course) {
    this.coursesSub.next([...this.coursesSub.value.slice(0), course]);
  }

  private updateCourseAndEmit(course: Course) {

    const courses = this.coursesSub.value.slice(0);

    const courseIndex = courses.findIndex(el => el.id == course.id);

    if (courseIndex >= 0) {
      courses[courseIndex] = course;
      this.coursesSub.next(courses);
    }
  }

  syncNewCourseThumbnail(c: Course) {
    this.coursesDB.suscribeToCourse(c.id)
      .pipe(
        filter(course => course.thumbnail !== c.thumbnail),
        tap(course => this.updateCourseAndEmit(course)),
        first()
      )
      .subscribe();
  }

  selectCourseDescription(course: Course):Observable<string> {

    const descriptionsMap = this.descriptionsSub.value;

    if (!descriptionsMap[course.id]) {
      this.coursesDB.findCourseDescription(course.id)
        .pipe(
          tap(desc => this.updateAndEmitDescription(course.id, desc))
        )
        .subscribe();
    }

    return this.descriptions$
      .pipe(
        map(descriptions => descriptions[course.id]),
        filter(desc => !!desc)
    );
  }

  saveCourseDescription(course: Course, longDescription:string) :Observable<any> {
    return undefined;
  }

  private updateAndEmitDescription(courseId:string, description:string) {

    const descriptionsMap = this.descriptionsSub.value;

    const newDescriptions  =  <any> {...descriptionsMap};

    newDescriptions[courseId] = description;

    this.descriptionsSub.next(newDescriptions);
  }

}




