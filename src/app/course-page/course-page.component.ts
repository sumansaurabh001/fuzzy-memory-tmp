import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs/Observable';
import {
  selectActiveCourse, selectActiveCourseAllLessons, selectActiveCourseDescription,
  selectActiveCourseSections
} from '../store/selectors';
import {UrlBuilderService} from '../services/url-builder.service';
import {Lesson} from '../models/lesson.model';
import {CourseSection} from '../models/course-section.model';

@Component({
  selector: 'course',
  templateUrl: './course-page.component.html',
  styleUrls: ['./course-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoursePageComponent implements OnInit {

  course$: Observable<Course>;

  courseDescription$: Observable<string>;

  sections$: Observable<CourseSection[]>;

  lessons$ : Observable<Lesson[]>;


  constructor(private store: Store<AppState>, private ub: UrlBuilderService) {

  }

  ngOnInit() {

    this.course$ = this.store.pipe(select(selectActiveCourse));

    this.courseDescription$ = this.store.pipe(select(selectActiveCourseDescription));

    this.sections$ = this.store.pipe(select(selectActiveCourseSections));

    this.lessons$ = this.store.pipe(select(selectActiveCourseAllLessons));

  }

  thumbnailUrl(course: Course) {
    return this.ub.buildCourseThumbailUrl(course);
  }


}
