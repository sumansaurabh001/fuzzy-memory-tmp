import {Component, Input, OnInit} from '@angular/core';
import {CourseSection} from '../models/course-section.model';
import {Lesson} from '../models/lesson.model';
import {Course} from '../models/course.model';
import {DeleteCourseSection} from '../store/course-section.actions';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {concatMap, filter, map, tap} from 'rxjs/operators';
import {AddLessonDialogComponent} from '../add-lesson-dialog/add-lesson-dialog.component';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {LoadingService} from '../services/loading.service';
import {LessonsDBService} from '../services/lessons-db.service';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store';
import {Observable} from 'rxjs/Observable';
import {selectActiveCourseAllLessons} from '../store/selectors';

@Component({
  selector: 'course-section',
  templateUrl: './course-section.component.html',
  styleUrls: ['./course-section.component.scss']
})
export class CourseSectionComponent implements OnInit {

  @Input() course: Course;
  @Input() section: CourseSection;

  lessons$: Observable<Lesson[]>;

  expandedLessons: { [key: string]: boolean } = {};

  constructor(
    private dialog: MatDialog,
    private lessonsDB: LessonsDBService,
    private loading: LoadingService,
    private store: Store<AppState>) {

  }

  ngOnInit() {

    this.lessons$ = this.store.pipe(
      select(selectActiveCourseAllLessons),
      map(lessons => lessons.filter(lesson => lesson.sectionId == this.section.id ))
      );

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

  trackByLessonId(index, item: Lesson) {
    return item.id;
  }

  expandedCss(expanded: boolean) {
    return expanded ? 'lesson-expanded' : null;
  }

  isExpanded(lesson: Lesson) {
    return this.expandedLessons[lesson.id];
  }

  onExpandLesson(lesson: Lesson, expanded) {
    this.expandedLessons[lesson.id] = expanded;
  }

}
