import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
