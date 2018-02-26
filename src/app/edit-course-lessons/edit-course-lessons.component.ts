import { Component } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../../model/course.model';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {MessagesService} from '../services/messages.service';

@Component({
  selector: 'edit-course-lessons',
  templateUrl: './edit-course-lessons.component.html',
  styleUrls: ['./edit-course-lessons.component.scss']
})
export class EditCourseLessonsComponent {

  course:Course;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private messages: MessagesService) {

    this.course = route.snapshot.data['course'];

    //this.messages.errors('Just an example, to see how the message looks like.', 'And yet another error, not sure if this is useful.');


    this.messages.error('Just an example, to see how the message looks like.');
  }

  deleteCourseDraft() {

    const config = new MatDialogConfig();

    config.autoFocus = true;

    config.data = {
      title: 'Deleting Course Draft',
      confirmationCode: this.course.url
    };

    this.dialog.open(ConfirmationDialogComponent, config);

  }

}
