import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs/Observable';
import {selectActiveCourse, selectActiveCourseDescription} from '../store/selectors';
import {UrlBuilderService} from '../services/url-builder.service';

@Component({
  selector: 'course',
  templateUrl: './course-page.component.html',
  styleUrls: ['./course-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoursePageComponent implements OnInit {

  course$: Observable<Course>;

  courseDescription$: Observable<string>;


  constructor(private store: Store<AppState>, private ub: UrlBuilderService) {

  }

  ngOnInit() {

    this.course$ = this.store.pipe(select(selectActiveCourse));

    this.courseDescription$ = this.store.pipe(select(selectActiveCourseDescription));

  }

  thumbnailUrl(course: Course) {
    return this.ub.buildCourseThumbailUrl(course);
  }


}
