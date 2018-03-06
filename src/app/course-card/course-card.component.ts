import {Component, Input, OnInit} from '@angular/core';
import {Course} from '../models/course.model';
import {EMPTY_IMG} from '../common/ui-constants';

@Component({
  selector: 'course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss']
})
export class CourseCardComponent implements OnInit {

  @Input() course: Course;

  constructor() { }

  ngOnInit() {
  }

  imgSrc() {
    return this.course && this.course.thumbnailUrl ? this.course.thumbnailUrl : EMPTY_IMG;
  }

}
