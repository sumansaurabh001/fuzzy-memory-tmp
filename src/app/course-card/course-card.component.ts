import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Course} from '../models/course.model';
import {EMPTY_IMG} from '../common/ui-constants';

@Component({
  selector: 'course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss']
})
export class CourseCardComponent implements OnInit {

  @Input() course: Course;

  @Input() first: boolean;

  @Input() last: boolean;

  @Output() moveUp = new EventEmitter();

  @Output() moveDown = new EventEmitter();


  ngOnInit() {
  }

  imgSrc() {
    if (this.course && this.course.thumbnail) {
      return this.course.thumbnail;
    }
    else {
      return EMPTY_IMG;
    }

  }

  onMoveUp() {
    this.moveUp.emit();
  }

  onMoveDown() {
    this.moveDown.emit();
  }
}
