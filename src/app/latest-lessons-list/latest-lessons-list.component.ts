import { Component, OnInit } from '@angular/core';
import {AppState} from '../store';
import {select, Store} from '@ngrx/store';
import {Lesson} from '../models/lesson.model';
import {User} from '../models/user.model';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs/internal/Observable';
import {selectAllLatestLessons} from '../store/latest-lessons.selectors';
import {LatestLesson} from '../models/latest-lesson.model';


@Component({
  selector: 'latest-lessons-list',
  templateUrl: './latest-lessons-list.component.html',
  styleUrls: ['./latest-lessons-list.component.scss']
})
export class LatestLessonsListComponent implements OnInit {

  latestLessons$: Observable<LatestLesson[]>;

  constructor(private store:Store<AppState>) {

  }

  ngOnInit() {

    this.latestLessons$ = this.store.pipe(select(selectAllLatestLessons));



  }


  navigateToLesson(courseUrlSegment: string, lessonSeqNo: number) {

  }
}
