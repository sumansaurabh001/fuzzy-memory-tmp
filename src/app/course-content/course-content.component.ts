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
export class CourseContentComponent implements OnInit, OnChanges {

  @Input()
  playlistMode = false;

  @Input()
  course: Course;

  @Input()
  sections: CourseSection[];

  @Input()
  lessons: Lesson[];

  dataSource = new MatTableDataSource([]);

  displayedColumns = ["lessonIcon", "lessonNumber", "description", "duration", "lessonViewed"];

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(changes:SimpleChanges) {
    if (changes['lessons']) {
      this.dataSource.data = changes['lessons'].currentValue;
    }
  }


  sectionLessons(section: CourseSection) {
    return this.lessons.filter(lesson => lesson.sectionId == section.id);
  }

}
