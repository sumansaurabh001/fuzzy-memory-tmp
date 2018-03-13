import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {filter, first, map, switchMap, tap} from 'rxjs/operators';
import {Course} from '../models/course.model';
import {CoursesDBService} from './courses-db.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {MessagesService} from './messages.service';
import {LoadingService} from './loading.service';
import {of} from 'rxjs/observable/of';
import {CourseSection} from '../models/course-section.model';
import {LessonsDBService} from './lessons-db.service';



export type CourseSectionsMap = {[key:string]:CourseSection[]};



@Injectable()
export class LessonsStore {

  private sectionsSub = new BehaviorSubject<CourseSectionsMap>({});

  courseSections$: Observable<CourseSectionsMap> = this.sectionsSub.asObservable();

  constructor(private lessonsDB: LessonsDBService,
              private messages: MessagesService,
              private loading: LoadingService) {

  }

  selectCourseSections(courseId: string): Observable<CourseSection[]> {

    const sections = this.sectionsSub.value;

    if (!sections[courseId]) {
      this.loadCourseSections(courseId, sections);
    }

    return this.courseSections$.pipe(
      map( sections => sections[courseId])
    );

  }

  private loadCourseSections(courseId:string, currentSections: CourseSectionsMap) {
    this.lessonsDB.loadCourseSectionsWithLessons(courseId)
      .pipe(
        tap(sections => {

          const newState = {...currentSections};

          newState[courseId] = sections;

          this.sectionsSub.next(newState);

        })
      )
      .subscribe();
  }


  createNewSection(course: Course, title:string): Observable<any> {
    return this.loading.showLoader(this.lessonsDB.addNewCourseSection(course, title))
      .pipe(
        tap(section => this.addSectionAndEmit(course, section))
      );
  }

  addSectionAndEmit(course:Course, section:CourseSection) {

    const newState = {...this.sectionsSub.value};

    if (!newState[course.id]) {
      newState[section.id] = [section];
    }
    else {

      const courseSections = newState[course.id].slice(0);

      courseSections[course.id].push(section);
    }

    this.sectionsSub.next(newState);
  }

}




