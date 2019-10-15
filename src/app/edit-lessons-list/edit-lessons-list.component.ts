import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  OnInit,
  Query,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {MessagesService} from '../services/messages.service';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs';
import {CourseSection} from '../models/course-section.model';
import {AddSectionDialogComponent} from '../add-section-dialog/add-section-dialog.component';
import {selectActiveCourse, isActiveCourseLoaded, selectActiveCourseSections, selectActiveCourseAllLessons} from '../store/selectors';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store';
import {deleteCourse} from '../store/course.actions';
import {LessonsDBService} from '../services/lessons-db.service';
import {LoadingService} from '../services/loading.service';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {EditSectionDialogComponent} from '../edit-section-dialog/edit-section-dialog.component';
import {Lesson} from '../models/lesson.model';
import {CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {updateLessonOrder} from '../store/lesson.actions';
import {concatMap, delay, filter, map, tap, withLatestFrom} from 'rxjs/operators';
import {deleteCourseSection, updateSectionOrder} from '../store/course-section.actions';
import {AddLessonDialogComponent} from '../add-lesson-dialog/add-lesson-dialog.component';
import {fadeIn} from '../common/fade-in-out';
import {sortLessonsBySectionAndSeqNo, sortSectionsBySeqNo} from '../common/sort-model';


@Component({
  selector: 'edit-lessons-list',
  templateUrl: './edit-lessons-list.component.html',
  styleUrls: ['./edit-lessons-list.component.scss']
})
export class EditLessonsListComponent implements OnInit {

  course$: Observable<Course>;

  sections$: Observable<CourseSection[]>;

  allLessons$: Observable<Lesson[]>;

  isCourseLoaded$: Observable<boolean>;

  expandedLessons: { [key: string]: boolean } = {};

  @ViewChildren(CdkDropList, {read: CdkDropList})
  allSectionDropLists: QueryList<CdkDropList>;

  areDropListsReady = false;

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

    this.allLessons$ = this.store
      .pipe(
        select(selectActiveCourseAllLessons),
        withLatestFrom(this.store.pipe(select(selectActiveCourseSections), map(sortSectionsBySeqNo))),
        map(([lessons, sections]) => sortLessonsBySectionAndSeqNo(lessons, sections))
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
          this.store.dispatch(deleteCourse({id: course.id}));
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

  dropLesson(course:Course,  evt: CdkDragDrop<Lesson[]>) {

    const previousIndex = evt.previousIndex,
      currentIndex = evt.currentIndex,
      newContainer = evt.container,
      previousContainer = evt.previousContainer,
      newSectionLessons = newContainer.data,
      previousSectionLessons = previousContainer.data,
      previousSectionId = previousContainer.element.nativeElement.getAttribute("sectionId"),
      newSectionId = newContainer.element.nativeElement.getAttribute("sectionId");

    if (previousIndex != currentIndex) {
      const action = updateLessonOrder({
        courseId: course.id,
        currentIndex,
        previousIndex,
        newSectionLessons,
        previousSectionLessons,
        previousSectionId,
        newSectionId
      });
      this.store.dispatch(action);
    }

  }

  findLessonsForSection(section: CourseSection, allLessons: Lesson[]) {

    const findBySectionId = lesson => lesson.sectionId == section.id;

    const sectionLessons = allLessons.filter(findBySectionId);

    const sectionStartIndex = allLessons.findIndex(findBySectionId);

    return {
      sectionLessons,
      sectionStartIndex
    };
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
        tap(() => this.store.dispatch(deleteCourseSection({id: section.id})))
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

  onSectionUp(course: Course, sections: CourseSection[], movedSection: CourseSection) {

    const newSortOrder = [...sections];

    const sectionIndex = newSortOrder.findIndex(section => section.id == movedSection.id);

    moveItemInArray(newSortOrder, sectionIndex, sectionIndex - 1);

    this.store.dispatch(updateSectionOrder({courseId:course.id, newSortOrder}));

    this.messages.info('Course section moved up.');

  }

  onSectionDown(course: Course, sections: CourseSection[], movedSection: CourseSection) {

    const newSortOrder = [...sections];

    const sectionIndex = newSortOrder.findIndex(section => section.id == movedSection.id);

    moveItemInArray(newSortOrder, sectionIndex, sectionIndex + 1);

    this.store.dispatch(updateSectionOrder({courseId:course.id, newSortOrder}));

    this.messages.info('Course section moved down.');

  }

  calculateConnectedLists(sectionSeqNo: number) {

    const dropLists = [...this.allSectionDropLists.toArray()];

    if (dropLists.length <= 1) {
      return [];
    }
    else {
      dropLists.splice(sectionSeqNo - 1, 1);
      return dropLists;
    }
  }


}
