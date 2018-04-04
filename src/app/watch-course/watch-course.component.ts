import { Component, OnInit } from '@angular/core';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs/Observable';
import {selectActiveCourse, selectActiveCourseAllLessons, selectActiveCourseSections, selectActiveLesson} from '../store/selectors';
import {select, Store} from '@ngrx/store';
import {CourseSection} from '../models/course-section.model';
import {Lesson} from '../models/lesson.model';
import {AppState} from '../store';
import {ActivatedRoute} from '@angular/router';
import {UrlBuilderService} from '../services/url-builder.service';



@Component({
  selector: 'watch-course',
  templateUrl: './watch-course.component.html',
  styleUrls: ['./watch-course.component.scss'],

})
export class WatchCourseComponent implements OnInit {

  course$: Observable<Course>;

  sections$: Observable<CourseSection[]>;

  lessons$ : Observable<Lesson[]>;

  activeLesson$: Observable<Lesson>;


  constructor(private store: Store<AppState>, public ub: UrlBuilderService) {

  }


  ngOnInit() {

    this.course$ = this.store.pipe(select(selectActiveCourse));

    this.sections$ = this.store.pipe(select(selectActiveCourseSections));

    this.lessons$ = this.store.pipe(select(selectActiveCourseAllLessons));

    this.activeLesson$ =  this.store.pipe(select(selectActiveLesson));

  }


}
