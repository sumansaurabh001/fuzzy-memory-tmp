import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Lesson} from '../models/lesson.model';
import {CourseSection} from '../models/course-section.model';
import {MatTableDataSource} from '@angular/material';
import {Course} from '../models/course.model';

@Component({
  selector: 'course-content',
  templateUrl: './course-content.component.html',
  styleUrls: ['./course-content.component.scss']
})
export class CourseContentComponent implements OnInit {

  @Input()
  playlistMode = false;

  @Input()
  course: Course;

  @Input()
  sections: CourseSection[];

  @Input()
  lessons: Lesson[];

  @Input()
  activeLesson: Lesson;


  constructor() { }

  ngOnInit() {

  }


  sectionLessons(section: CourseSection) {
    return this.lessons.filter(lesson => lesson.sectionId == section.id);
  }



  onLessonViewedClicked(event, lesson) {
    event.stopPropagation();
  }


  lessonClasses(lesson: Lesson) {
    return lesson && this.activeLesson && (lesson.id == this.activeLesson.id) ? 'active-lesson': undefined;
  }



}
