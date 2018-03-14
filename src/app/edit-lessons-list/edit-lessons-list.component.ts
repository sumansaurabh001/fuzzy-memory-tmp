import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {MessagesService} from '../services/messages.service';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs/Observable';
import {CourseSection} from '../models/course-section.model';
import {concatMap, filter, first, map, switchMap} from 'rxjs/operators';
import {AddSectionDialogComponent} from '../add-section-dialog/add-section-dialog.component';
import {selectAllCourses, selectEditedCourse} from '../store/course.selectors';
import {select, Store} from '@ngrx/store';
import {State} from '../store';
import {DeleteCourse} from '../store/course.actions';


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
              private store: Store<State>,
              private messages: MessagesService) {


    this.course$ = this.store.pipe(select(selectEditedCourse));



    /*

    TODO

    this.courseSections$ =  this.course$
      .pipe(
        first(),
        switchMap(course => this.lessonsStore.selectCourseSections(course.id))
      );

    */

  }

  addCourseSection(course:Course) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.minWidth = '500px';

    const dialogRef = this.dialog.open(AddSectionDialogComponent, dialogConfig);

    /*

    TODO

    dialogRef.afterClosed()
      .pipe(
        filter(result => !!result),
        concatMap(result => this.lessonsStore.createNewSection(course, result.title))
      )
      .subscribe();

      */

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
          this.store.dispatch(new DeleteCourse({id:course.id}));
        }
      });



  }

}
