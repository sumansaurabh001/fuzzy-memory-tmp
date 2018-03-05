import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {CoursesService} from '../services/courses.service';
import {MessagesService} from '../services/messages.service';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs/Observable';
import {map, withLatestFrom} from 'rxjs/operators';


@Component({
  selector: 'edit-course-lessons',
  templateUrl: './edit-course-lessons.component.html',
  styleUrls: ['./edit-course-lessons.component.scss']
})
export class EditCourseLessonsComponent {

  course$: Observable<Course>;

  constructor(private dialog: MatDialog,
              private route: ActivatedRoute,
              private router: Router,
              private messages: MessagesService,
              private coursesService: CoursesService) {

    this.course$ = this.coursesService.findCourseByUrl(route.snapshot.params['courseId']);

  }

  deleteCourseDraft(course:Course) {

    const config = new MatDialogConfig();

    config.autoFocus = true;

    config.data = {
      title: 'Deleting Course Draft',
      confirmationCode: course.url
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, config);

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result.confirmed) {
          this.coursesService.deleteCourseDraft(course.id)
            .subscribe(
              () => this.router.navigateByUrl('/'),
              err => this.messages.error('Error deleting course draft.')
            );
        }
      });

  }

}
