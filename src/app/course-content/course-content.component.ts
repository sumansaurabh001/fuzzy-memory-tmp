import {Component, Input, OnInit} from '@angular/core';
import {Lesson} from '../models/lesson.model';
import {CourseSection} from '../models/course-section.model';

@Component({
  selector: 'course-content',
  templateUrl: './course-content.component.html',
  styleUrls: ['./course-content.component.scss']
})
export class CourseContentComponent implements OnInit {

  @Input()
  sections: CourseSection[];

  @Input()
  lessons: Lesson[];

  constructor() { }

  ngOnInit() {

  }


}
