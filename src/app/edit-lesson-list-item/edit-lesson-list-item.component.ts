import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Lesson} from '../models/lesson.model';
import {Course} from '../models/course.model';
import {fadeIn} from '../common/fade-in-out';

@Component({
  selector: 'edit-lesson-list-item',
  templateUrl: './edit-lesson-list-item.component.html',
  styleUrls: ['./edit-lesson-list-item.component.scss'],
  animations: [fadeIn]
})
export class EditLessonListItemComponent implements OnInit {

  @Input()
  lesson: Lesson;

  @Input()
  course:Course;

  @Input()
  index:number;

  @Input()
  expanded:boolean;

  @Output()
  expandChanged = new EventEmitter<boolean>();

  mouseOver = false;

  constructor() { }

  ngOnInit() {

  }

  expandedCss(expanded: boolean) {
    return expanded ? 'lesson-expanded' : null;
  }


  onExpanded(expanded: boolean) {
    this.expandChanged.emit(expanded);
  }
}
