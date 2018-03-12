import {Component, Input, OnInit} from '@angular/core';
import {Lesson} from '../models/lesson.model';

@Component({
  selector: 'edit-lesson',
  templateUrl: './edit-lesson.component.html',
  styleUrls: ['./edit-lesson.component.scss']
})
export class EditLessonComponent implements OnInit {

  @Input() lesson: Lesson;

  constructor() { }

  ngOnInit() {
  }

}
