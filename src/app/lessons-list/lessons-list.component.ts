import {Component, Input, OnInit} from '@angular/core';
import {Lesson} from '../models/lesson.model';
import {Course} from '../models/course.model';

@Component({
  selector: 'lessons-list',
  templateUrl: './lessons-list.component.html',
  styleUrls: ['./lessons-list.component.scss']
})
export class LessonsListComponent implements OnInit {

  @Input()
  course:Course;

  @Input()
  sectionSeqNo:number;

  @Input()
  lessons: Lesson[];

  @Input()
  highlightedLesson: Lesson;

  @Input()
  playlistMode:boolean;

  constructor() { }

  ngOnInit() {

  }

  onLessonViewedClicked(event, lesson) {
    event.stopPropagation();
  }


  lessonClasses(lesson: Lesson) {
    return lesson && this.highlightedLesson && (lesson.id == this.highlightedLesson.id) ? 'active-lesson': undefined;
  }

}
