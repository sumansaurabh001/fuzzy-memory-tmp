import {Component, Input, OnInit} from '@angular/core';
import {Course} from '../models/course.model';

@Component({
  selector: 'course-status',
  templateUrl: './course-status.component.html',
  styleUrls: ['./course-status.component.scss']
})
export class CourseStatusComponent implements OnInit {

  @Input()
  course:Course;

  constructor() { }

  ngOnInit() {
  }

}
