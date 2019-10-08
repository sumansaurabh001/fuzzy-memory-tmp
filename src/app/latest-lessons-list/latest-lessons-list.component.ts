import { Component, OnInit } from '@angular/core';
import {AppState} from '../store';
import {select, Store} from '@ngrx/store';
import {Lesson} from '../models/lesson.model';
import {User} from '../models/user.model';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs/internal/Observable';
import {selectAllLatestLessons} from '../store/latest-lessons.selectors';
import {LatestLesson} from '../models/latest-lesson.model';
import {selectAllCourses} from '../store/selectors';
import {combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';

interface LatestLessonsListData {
  latestLessons: LatestLesson[];
  courses: Course[];
}


@Component({
  selector: 'latest-lessons-list',
  templateUrl: './latest-lessons-list.component.html',
  styleUrls: ['./latest-lessons-list.component.scss']
})
export class LatestLessonsListComponent implements OnInit {

  data$: Observable<LatestLessonsListData>;

  constructor(private store:Store<AppState>) {

  }

  ngOnInit() {

    const latestLessons$ = this.store.pipe(select(selectAllLatestLessons));

    const courses$ = this.store.pipe(select(selectAllCourses));

    this.data$ = combineLatest([latestLessons$, courses$])
      .pipe(
        map(([latestLessons, courses]) => {return {latestLessons, courses}})
      );

  }

  findCourseListIcon(courseId:string, courses: Course[]) {

    const course = courses.find(course => course.id == courseId);

    return course.lessonIconUrl;

  }


  navigateToLesson(courseUrlSegment: string, lessonSeqNo: number) {

  }

}
