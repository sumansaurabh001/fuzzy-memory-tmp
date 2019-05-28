import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Course} from '../models/course.model';
import {select, Store} from '@ngrx/store';
import {selectActiveCourse} from '../store/selectors';
import {AppState} from '../store';

@Component({
  selector: 'publish-course',
  templateUrl: './publish-course.component.html',
  styleUrls: ['./publish-course.component.scss']
})
export class PublishCourseComponent implements OnInit {

  course$: Observable<Course>;

  constructor(
    private store: Store<AppState>) {

  }

  ngOnInit() {

    this.course$ = this.store.pipe(select(selectActiveCourse));

  }

}
