import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {CoursesService} from '../services/courses.service';
import {MessagesService} from '../services/messages.service';
import {Course} from '../models/course.model';


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
    private router: Router,
    private messages: MessagesService,
    private coursesService: CoursesService) {

    this.course = route.snapshot.data['course'];
  }

  deleteCourseDraft() {

    const config = new MatDialogConfig();

    config.autoFocus = true;

    config.data = {
      title: 'Deleting Course Draft',
      confirmationCode: this.course.url
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, config);

    dialogRef.afterClosed().subscribe(result => {

      if (result.confirmed) {
        this.coursesService.deleteCourseDraft(this.course.id)
          .subscribe(
            () => this.router.navigateByUrl('/'),
            err => this.messages.error('Error deleting course draft.')
          );
      }

    });

  }

}
