import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig} from '@angular/material';
import {MessagesService} from '../services/messages.service';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs/Observable';
import {CourseSection} from '../models/course-section.model';
import {AddSectionDialogComponent} from '../add-section-dialog/add-section-dialog.component';
import {selectEditedCourseDetail, selectEditedCourseSummary} from '../store/selectors';
import {select, Store} from '@ngrx/store';
import {State} from '../store';
import {DeleteCourse} from '../store/course.actions';
import { DeleteCourseSection} from '../store/course-section.actions';
import {LessonsDBService} from '../services/lessons-db.service';
import {LoadingService} from '../services/loading.service';
import {AddLessonDialogComponent} from '../add-lesson-dialog/add-lesson-dialog.component';
import {DangerDialogComponent} from '../danger-dialog/danger-dialog.component';
import {concatMap, filter, tap} from 'rxjs/operators';
import {DeleteLesson} from '../store/lesson.actions';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'edit-lessons-list',
  templateUrl: './edit-lessons-list.component.html',
  styleUrls: ['./edit-lessons-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditLessonsListComponent implements OnInit {

  course$: Observable<Course>;

  constructor(private dialog: MatDialog,
              private route: ActivatedRoute,
              private messages: MessagesService,
              private lessonsDB: LessonsDBService,
              private loading: LoadingService,
              private router: Router,
              private store: Store<State>) {

  }


  ngOnInit() {

    this.course$ = this.store
      .pipe(
        select(selectEditedCourseDetail)
      );

  }


  addSection(course: Course) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.minWidth = '500px';
    dialogConfig.data = {course};

    const dialogRef = this.dialog.open(AddSectionDialogComponent, dialogConfig);

  }


  deleteSection(course: Course, section: CourseSection) {

    const config = new MatDialogConfig();

    config.autoFocus = true;

    config.data = {
      title: 'Delete Course Section',
      confirmationText: 'Are you sure you want to delete this Section?'
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, config);

    dialogRef.afterClosed()
      .pipe(
        filter(result => result.confirm),
        concatMap(() => this.loading.showLoader(this.lessonsDB.deleteSection(course.id, section.id))),
        tap(() => this.store.dispatch(new DeleteCourseSection({id:section.id})))
      )
      .subscribe();
  }


  addLesson(course:Course, section:CourseSection) {


    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.minWidth = '500px';
    dialogConfig.data = {course, section};

    const dialogRef = this.dialog.open(AddLessonDialogComponent, dialogConfig);

  }


  deleteCourseDraft(course: Course) {

    const config = new MatDialogConfig();

    config.autoFocus = true;

    config.data = {
      title: 'Delete Course Draft',
      confirmationText: 'Are you sure you want to delete this Course Draft?'
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, config);

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result.confirm) {
          this.store.dispatch(new DeleteCourse({id: course.id}));
          this.router.navigateByUrl('/courses');
        }
      });

  }

  emptyCourseStyles(course:Course): string[] {
    if (course.sections.length == 0) {
      return ['mat-elevation-z7', 'empty-course'];
    }
    else {
      return [];
    }
  }


}
