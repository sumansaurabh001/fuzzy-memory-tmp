import {Component, Input, OnInit} from '@angular/core';
import {Lesson} from '../models/lesson.model';
import {State} from '../store';
import {Store} from '@ngrx/store';
import {LessonsDBService} from '../services/lessons-db.service';
import {Course} from '../models/course.model';
import {LoadingService} from '../services/loading.service';
import {DeleteLesson} from '../store/lesson.actions';

@Component({
  selector: 'edit-lesson',
  templateUrl: './edit-lesson.component.html',
  styleUrls: ['./edit-lesson.component.scss']
})
export class EditLessonComponent implements OnInit {

  @Input() course:Course;
  @Input() lesson: Lesson;

  constructor(
    private store: Store<State>,
    private loading: LoadingService,
    private lessonsDB: LessonsDBService
  ) {

  }

  ngOnInit() {

  }

  deleteLesson() {
    this.loading.showLoader(this.lessonsDB.deleteLesson(this.course, this.lesson))
      .subscribe(
        () => this.store.dispatch(new DeleteLesson({id: this.lesson.id}))
      );
  }

}
