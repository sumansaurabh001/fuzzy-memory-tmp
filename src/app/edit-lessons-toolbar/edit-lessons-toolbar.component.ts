import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'edit-lessons-toolbar',
  templateUrl: './edit-lessons-toolbar.component.html',
  styleUrls: ['./edit-lessons-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditLessonsToolbarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
