import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs/Observable';
import {selectActiveCourse, selectActiveCourseDetail} from '../store/selectors';
import {UrlBuilderService} from '../services/url-builder.service';

@Component({
  selector: 'course',
  templateUrl: './course-page.component.html',
  styleUrls: ['./course-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoursePageComponent implements OnInit {

  course$: Observable<Course>;

  constructor(private store: Store<AppState>, private ub: UrlBuilderService) {



  }

  ngOnInit() {

    this.course$ = this.store.pipe(select(selectActiveCourseDetail));

  }

  thumbnailUrl(course: Course) {
    return this.ub.buildCourseThumbailUrl(course);
  }


}
