import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {ApplicationStore} from '../services/application-store.service';
import {MessagesService} from '../services/messages.service';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs/Observable';


@Component({
  selector: 'edit-lessons-list',
  templateUrl: './edit-lessons-list.component.html',
  styleUrls: ['./edit-lessons-list.component.scss']
})
export class EditLessonsListComponent {

  course$: Observable<Course>;

  constructor(private dialog: MatDialog,
              private route: ActivatedRoute,
              private router: Router,
              private messages: MessagesService,
              private store: ApplicationStore) {

    this.course$ = this.store.selectCourseByUrl(route.snapshot.params['courseUrl']);

  }

  addCourseSection() {

  }


  addLesson() {


  }



  deleteCourseDraft(course: Course) {

    const config = new MatDialogConfig();

    config.autoFocus = true;

    config.data = {
      title: 'Deleting Course Draft',
      confirmationCode: course.url
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, config);

    dialogRef.afterClosed()
      .subscribe(confirmed => {
        if (confirmed) {

          this.store.deleteCourseDraft(course.id)
            .subscribe(
              () => this.router.navigateByUrl('/'),
              err => this.messages.error('Error deleting course draft.')
            );
        }
      });

  }

}
