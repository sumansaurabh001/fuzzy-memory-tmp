import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Lesson} from '../models/lesson.model';
import {CourseSection} from '../models/course-section.model';
import { MatTableDataSource } from '@angular/material/table';
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
  lessonsWatched:string[] = [];

  @Input()
  activeLesson: Lesson;

  constructor() {}

  ngOnInit() {

  }

  sectionLessons(section: CourseSection) {

    if (!section) {
      return {sectionLessons:[], sectionStartIndex:0};
    }

    const findBySectionId = lesson => lesson.sectionId == section.id;

    const sectionLessons = this.lessons.filter(findBySectionId);

    const sectionStartIndex = this.lessons.findIndex(findBySectionId);

    return {
      sectionLessons,
      sectionStartIndex
    };


  }

  calculateSectionLength(section:CourseSection) {
    return this.sectionLessons(section).sectionLessons.length;
  }


  calculateLessonsCompleted(section:CourseSection) {

    if (!this.lessons || !this.lessonsWatched) {
      return 0;
    }

    const sectionLessonIds = this.sectionLessons(section).sectionLessons.map(lesson => lesson.id);

    let counter = 0;

    sectionLessonIds.forEach(lessonId => {
      if (this.lessonsWatched.includes(lessonId)) {
        counter += 1;
      }
    });

    return counter;

  }


}
