import { Component, OnInit } from '@angular/core';
import {AppState} from '../store';
import {Store} from '@ngrx/store';
import {Lesson} from '../models/lesson.model';
import {User} from '../models/user.model';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs/internal/Observable';

interface LatestLesssonsData {
  user:User;
  latestLessons: Lesson[];
};


@Component({
  selector: 'latest-lessons-list',
  templateUrl: './latest-lessons-list.component.html',
  styleUrls: ['./latest-lessons-list.component.scss']
})
export class LatestLessonsListComponent implements OnInit {

  data$ : Observable<LatestLesssonsData>;

  constructor(private store:Store<AppState>) {

  }

  ngOnInit() {


  }


  navigateToLesson(courseUrlSegment: string, lessonSeqNo: number) {

  }
}
