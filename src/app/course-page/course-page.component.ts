import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store';
import {Course} from '../models/course.model';
import {Observable, BehaviorSubject} from 'rxjs';
import {
  isAdmin,
  selectActiveCourse, selectActiveCourseAllLessons, selectActiveCourseDescription,
  selectActiveCourseSections, selectUser, selectUserCourses
} from '../store/selectors';
import {UrlBuilderService} from '../services/url-builder.service';
import {Lesson} from '../models/lesson.model';
import {CourseSection} from '../models/course-section.model';
import {filter, map, startWith, tap, withLatestFrom} from 'rxjs/operators';
import {CollapsibleTriggerComponent} from '../collapsible-trigger/collapsible-trigger.component';
import {sortSectionsBySeqNo} from '../common/sort-model';
import {User} from '../models/user.model';

const DESCRIPTION_MAX_LENGTH = 1500;


@Component({
  selector: 'course',
  templateUrl: './course-page.component.html',
  styleUrls: ['./course-page.component.scss']
})
export class CoursePageComponent implements OnInit {

  course$: Observable<Course>;

  courseDescription$: Observable<string>;

  sections$: Observable<CourseSection[]>;

  lessons$: Observable<Lesson[]>;



  showFullDescription = false;


  constructor(private store: Store<AppState>, private ub: UrlBuilderService) {

  }

  ngOnInit() {

    this.course$ = this.store.pipe(select(selectActiveCourse));

    this.sections$ = this.store
      .pipe(
        select(selectActiveCourseSections),
        map(sortSectionsBySeqNo)
      );

    this.lessons$ = this.store.pipe(select(selectActiveCourseAllLessons));

    this.courseDescription$ = this.selectDescription();

  }

  selectDescription() {
    return this.store
      .pipe(
        select(selectActiveCourseDescription),
        filter(description => !!description),
        map(description => {

          return this.showFullDescription ? description : description.slice(0, description.indexOf('>', DESCRIPTION_MAX_LENGTH));

        })
      );
  }

  thumbnailUrl(course: Course) {
    return this.ub.buildCourseThumbailUrl(course);
  }

  toggleShowMore() {
    this.showFullDescription = true;
    this.courseDescription$ = this.selectDescription();

  }


}
