import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {MessagesService} from '../services/messages.service';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs/Observable';
import {CourseSection} from '../models/course-section.model';
import {CoursesStore} from '../services/courses.store';
import {LessonsStore} from '../services/lessons.store';
import {concatMap, filter, first, switchMap} from 'rxjs/operators';
import {AddSectionDialogComponent} from '../add-section-dialog/add-section-dialog.component';


@Component({
  selector: 'edit-lessons-list',
  templateUrl: './edit-lessons-list.component.html',
  styleUrls: ['./edit-lessons-list.component.scss']
})
export class EditLessonsListComponent {

  course$: Observable<Course>;
  courseSections$: Observable<CourseSection[]>;

  constructor(private dialog: MatDialog,
              private route: ActivatedRoute,
              private router: Router,
              private messages: MessagesService,
              private coursesStore: CoursesStore,
              private lessonsStore: LessonsStore) {

    this.course$ = this.coursesStore.selectCourseByUrl(route.snapshot.params['courseUrl']);

    this.courseSections$ =  this.course$
      .pipe(
        first(), //TODO
        switchMap(course => this.lessonsStore.selectCourseSections(course.id))
      );

  }

  addCourseSection(course:Course) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.minWidth = '500px';

    const dialogRef = this.dialog.open(AddSectionDialogComponent, dialogConfig);

    dialogRef.afterClosed()
      .pipe(
        filter(result => !!result),
        concatMap(result => this.lessonsStore.createNewSection(course, result.title))
      )
      .subscribe();

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

          this.coursesStore.deleteCourseDraft(course.id)
            .subscribe(
              () => this.router.navigateByUrl('/'),
              err => this.messages.error('Error deleting course draft.')
            );
        }
      });

  }

}
