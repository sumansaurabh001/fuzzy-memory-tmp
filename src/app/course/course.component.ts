import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs/Observable';
import {selectEditedCourse, selectEditedCourseDetail} from '../store/selectors';
import {UrlBuilderService} from '../services/url-builder.service';

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseComponent implements OnInit {

  course$: Observable<Course>;

  constructor(private store: Store<AppState>, private ub: UrlBuilderService) {



  }

  ngOnInit() {

    this.course$ = this.store.pipe(select(selectEditedCourseDetail));

  }

  thumbnailUrl(course: Course) {
    return this.ub.buildCourseThumbailUrl(course);
  }


}
