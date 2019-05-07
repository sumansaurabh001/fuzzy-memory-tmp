import {ChangeDetectionStrategy, Component, ElementRef, Inject, OnInit, Query, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig} from '@angular/material';
import {MessagesService} from '../services/messages.service';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs';
import {CourseSection} from '../models/course-section.model';
import {AddSectionDialogComponent} from '../add-section-dialog/add-section-dialog.component';
import {selectActiveCourse, isActiveCourseLoaded, selectActiveCourseSections, selectActiveCourseAllLessons} from '../store/selectors';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store';
import {DeleteCourse} from '../store/course.actions';
import {LessonsDBService} from '../services/lessons-db.service';
import {LoadingService} from '../services/loading.service';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {EditSectionDialogComponent} from '../edit-section-dialog/edit-section-dialog.component';
import {Lesson} from '../models/lesson.model';
import {CdkDropList} from '@angular/cdk/drag-drop';
import {UpdateLessonOrder} from '../store/lesson.actions';
import {concatMap, filter, map, tap} from 'rxjs/operators';
import {DeleteCourseSection} from '../store/course-section.actions';
import {AddLessonDialogComponent} from '../add-lesson-dialog/add-lesson-dialog.component';
import {fadeIn} from '../common/fade-in-out';


@Component({
  selector: 'edit-lessons-list',
  templateUrl: './edit-lessons-list.component.html',
  styleUrls: ['./edit-lessons-list.component.scss']
})
export class EditLessonsListComponent implements OnInit {

  course$: Observable<Course>;

  sections$: Observable<CourseSection[]>;

  isCourseLoaded$: Observable<boolean>;

  expandedLessons: { [key: string]: boolean } = {};

  @ViewChildren(CdkDropList, {read: CdkDropList})
  allSectionDropLists: QueryList<CdkDropList>;

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

  editSectionTitle(course: Course, section: CourseSection) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.minWidth = '500px';
    dialogConfig.data = {course, section};

    const dialogRef = this.dialog.open(EditSectionDialogComponent, dialogConfig);
  }

  dropLesson(evt) {

    console.log(evt);

    const previousIndex = evt.previousIndex,
      currentIndex = evt.currentIndex,
      previousContainer: CdkDropList = evt.previousContainer,
      container: CdkDropList = evt.container;



    /*

    const action = new UpdateLessonOrder({
      sourceSectionId: section.id,
      lessonId:sourceSectionLessons[previousIndex].id,
      currentIndex,
      previousIndex
    });

    console.log(action);

    this.store.dispatch(action);


    */

  }

  findLessonsForSection(section: CourseSection): Observable<Lesson[]> {
    return this.store.pipe(
      select(selectActiveCourseAllLessons),
      map(lessons => lessons.filter(lesson => lesson.sectionId == section.id))
    );
  }

  trackByLessonId(index, item: Lesson) {
    return item.id;
  }

  onExpandLesson(lesson: Lesson, expanded) {
    this.expandedLessons[lesson.id] = expanded;
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
        tap(() => this.store.dispatch(new DeleteCourseSection({id: section.id})))
      )
      .subscribe();
  }


  addLesson(course: Course, section: CourseSection) {


    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.minWidth = '500px';
    dialogConfig.data = {course, section};

    const dialogRef = this.dialog.open(AddLessonDialogComponent, dialogConfig);

  }

  otherSectionsDropLists(sectionIndex: number) {

    const otherSectionsDropLists = this.allSectionDropLists.toArray();

    otherSectionsDropLists.splice(sectionIndex, 1);

    return otherSectionsDropLists;

  }
}
