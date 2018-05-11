import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig} from '@angular/material';
import {MessagesService} from '../services/messages.service';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs';
import {CourseSection} from '../models/course-section.model';
import {AddSectionDialogComponent} from '../add-section-dialog/add-section-dialog.component';
import { selectActiveCourse, isActiveCourseLoaded, selectActiveCourseSections} from '../store/selectors';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store';
import {DeleteCourse} from '../store/course.actions';
import {DeleteCourseSection} from '../store/course-section.actions';
import {LessonsDBService} from '../services/lessons-db.service';
import {LoadingService} from '../services/loading.service';
import {AddLessonDialogComponent} from '../add-lesson-dialog/add-lesson-dialog.component';
import {DangerDialogComponent} from '../danger-dialog/danger-dialog.component';
import {concatMap, filter, tap} from 'rxjs/operators';
import {DeleteLesson} from '../store/lesson.actions';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {Lesson} from '../models/lesson.model';


@Component({
  selector: 'edit-lessons-list',
  templateUrl: './edit-lessons-list.component.html',
  styleUrls: ['./edit-lessons-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditLessonsListComponent implements OnInit {

  course$: Observable<Course>;

  sections$: Observable<CourseSection[]>;

  isCourseLoaded$: Observable<boolean>;

  constructor(private dialog: MatDialog,
              private route: ActivatedRoute,
              private messages: MessagesService,
              private lessonsDB: LessonsDBService,
              private loading: LoadingService,
              private router: Router,
              private store: Store<AppState>) {

  }


  ngOnInit() {

    this.course$ = this.store.pipe(select(selectActiveCourse));

    this.sections$ = this.store.pipe(select(selectActiveCourseSections));

    this.isCourseLoaded$ = this.store.pipe(select(isActiveCourseLoaded));

  }


  addSection(course: Course) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.minWidth = '500px';
    dialogConfig.data = {course};

    const dialogRef = this.dialog.open(AddSectionDialogComponent, dialogConfig);

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

  emptyCourseCss(course: Course, sections): string[] {
    if (sections.length == 0) {
      return ['mat-elevation-z7', 'empty-course'];
    }
    else {
      return [];
    }
  }




}
