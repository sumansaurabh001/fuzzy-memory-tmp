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

  selectCourseSections(courseUrl: string): Observable<CourseSection[]> {
    return undefined;
  }

}




