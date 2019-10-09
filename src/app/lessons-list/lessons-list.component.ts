import {Component, Input, OnInit} from '@angular/core';
import {Lesson} from '../models/lesson.model';
import {Course} from '../models/course.model';
import {UserLessonStatus} from '../models/user-lesson-status';
import {AppState} from '../store';
import {select, Store} from '@ngrx/store';
import {updateLessonWatchStatus} from '../store/user-lesson-status.actions';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {isAnonymousUser, User} from '../models/user.model';
import {selectUser} from '../store/selectors';
import {MessagesService} from '../services/messages.service';

@Component({
  selector: 'lessons-list',
  templateUrl: './lessons-list.component.html',
  styleUrls: ['./lessons-list.component.scss']
})
export class LessonsListComponent implements OnInit {

  @Input()
  course: Course;

  @Input()
  sectionSeqNo: number;

  @Input()
  lessons: {sectionLessons: Lesson[],  sectionStartIndex: number} = {sectionLessons: [], sectionStartIndex: 0};

  @Input()
  lessonsWatched: string[] = [];

  @Input()
  highlightedLesson: Lesson;

  @Input()
  playlistMode: boolean;

  user: User;

  constructor(
    private store: Store<AppState>,
    private messages: MessagesService) {
  }

  ngOnInit() {

    this.store.pipe(
      select(selectUser)
    )
    .subscribe(user => this.user = user);

  }


  onLessonViewedClicked(event: MatCheckboxChange, lesson: Lesson) {

    if (isAnonymousUser(this.user)) {
      this.messages.info("Please login first, in order to mark lessons as viewed.");
      return;
    }

    const userLessonStatus: UserLessonStatus = {
      id: lesson.id,
      courseId: this.course.id,
      watched: event.checked
    };

    this.store.dispatch(updateLessonWatchStatus({userLessonStatus}));

  }

  onCheckBoxToggled(event) {
    event.stopPropagation();
  }

  isLessonWatched(lesson: Lesson) {
    return this.lessonsWatched.includes(lesson.id);
  }


  lessonClasses(lesson: Lesson) {
    return lesson && this.highlightedLesson && (lesson.id == this.highlightedLesson.id) ? 'active-lesson' : undefined;
  }

}
