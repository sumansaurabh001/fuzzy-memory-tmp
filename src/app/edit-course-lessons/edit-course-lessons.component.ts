import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../../model/course.model';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'edit-course-lessons',
  templateUrl: './edit-course-lessons.component.html',
  styleUrls: ['./edit-course-lessons.component.scss']
})
export class EditCourseLessonsComponent implements OnInit {

  course:Course;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute) {

    this.course = route.snapshot.data['course'];
  }

  ngOnInit() {

  }

  deleteCourseDraft() {

    console.log('Opening dialog');

    const config = new MatDialogConfig();

    config.autoFocus = true;

    config.data = {
      title: 'Deleting Course Draft',
      textWarning: `The whole course draft will be deleted, this operation cannot be reversed.`,
      confirmationCode: this.course.url
    };

    this.dialog.open(ConfirmationDialogComponent, config);

  }

}
