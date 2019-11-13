import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {LessonQuestion} from '../models/lesson-question.model';
import {Question} from '../models/question.model';
import {fullOptionsEditorConfig} from '../common/html-editor.config';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {EditTitleDescriptionDialogComponent} from '../edit-title-description-dialog/edit-title-description-dialog.component';
import {filter, map, tap} from 'rxjs/operators';
import {addNewQuestion, deleteQuestion, editQuestion} from '../store/questions.actions';
import {Observable} from 'rxjs/internal/Observable';
import {Answer} from '../models/answer.model';
import {of} from 'rxjs/internal/observable/of';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store';
import {AngularFirestore} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

import {format} from 'timeago.js';
import {User} from '../models/user.model';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {deleteCourse} from '../store/course.actions';
import {addNewAnswer, deleteAnswer, editAnswer, loadAnswers} from '../store/answers.actions';
import {selectQuestionAnswers} from '../store/answers.selectors';
import {highlightCodeBlocks} from '../common/highlightjs-utils';
import {navigateToLesson} from '../store/latest-lesson.actions';
import {LessonsDBService} from '../services/lessons-db.service';


@Component({
  selector: 'questions-list-item',
  templateUrl: './questions-list-item.component.html',
  styleUrls: ['./questions-list-item.component.scss']
})
export class QuestionsListItemComponent implements OnInit, OnChanges {

  @Input()
  question: LessonQuestion;

  @Input()
  user: User;

  @Input()
  showAnswers = undefined;

  @Input()
  showGoToLessonLink = false;

  @Output()
  answersOpened = new EventEmitter();

  @Output()
  answersClosed = new EventEmitter();

  answers$: Observable<Answer[]> = of([]);

  questionTimeAgo = "";

  constructor(
    private dialog: MatDialog,
    private store: Store<AppState>,
    private afs: AngularFirestore,
    private lessonsDB: LessonsDBService) {

  }

  ngOnInit() {


  }

  ngOnChanges(changes: SimpleChanges) {
    const change = changes['showAnswers'];
    if (change && change.currentValue && change.previousValue == undefined) {
      this.loadAnswers();
      this.showAnswers = true;
    }
    if(changes["question"] && changes["question"].currentValue) {
      const createdAt = changes["question"].currentValue.createdAt;
      this.questionTimeAgo = format(createdAt.toMillis());
    }
  }


  openAnswers() {

    this.showAnswers = true;

    this.answersOpened.next();

    this.loadAnswers();
  }

  loadAnswers() {
    this.store.dispatch(loadAnswers({
      courseId: this.question.courseId,
      questionId: this.question.id,
      lessonId: this.question.lessonId
    }));

    this.answers$ = this.store.pipe(
      select(selectQuestionAnswers(this.question.id)),
      map(answers => answers.map(answer => {
        const newAnswer = {...answer};
        newAnswer["createdTimeAgo"] = format(answer.createdAt.toMillis());
        return newAnswer;
      })),
      tap(() => {
        highlightCodeBlocks();
      })
    );
  }

  backToQuestions() {

    this.showAnswers = false;

    this.answersClosed.next();

  }

  isOwner() {
    return this.user && this.user.id == this.question.userId;
  }


  onDeleteQuestion() {

    const config = new MatDialogConfig();

    config.autoFocus = true;

    config.data = {
      title: 'Delete Question',
      confirmationText: 'Are you sure you want to delete this question?'
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, config);

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result.confirm) {
          this.store.dispatch(deleteQuestion({
            courseId: this.question.courseId,
            questionId: this.question.id
          }));
        }
      });


  }

  onEditQuestion() {

    const editorConfig = fullOptionsEditorConfig();

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '710px';
    dialogConfig.data = {
      title: this.question.title,
      description: this.question.questionText,
      dialogTitle: 'Edit Question',
      titlePlaceHolder: 'Type here the question title...',
      descriptionPlaceholder: 'Type here your question...',
      editorConfig
    };

    this.dialog.open(EditTitleDescriptionDialogComponent, dialogConfig)
      .afterClosed()
      .pipe(
        filter(edited => !!edited),
        tap((edited: any) => {
          this.store.dispatch(editQuestion({
            courseId: this.question.courseId,
            update: {
              id: this.question.id,
              changes: {
                title: edited.title,
                questionText: edited.description
              }
            }
          }));
        })
      )
      .subscribe();
  }


  onAddAnswer() {

    const editorConfig = fullOptionsEditorConfig();

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '710px';
    dialogConfig.data = {
      dialogTitle: 'Add a New Answer',
      titlePlaceHolder: 'Type here the answer title...',
      descriptionPlaceholder: 'Type here your answer...',
      editorConfig,
      showTitle: false
    };

    this.dialog.open(EditTitleDescriptionDialogComponent, dialogConfig)
      .afterClosed()
      .pipe(
        filter(answer => !!answer),
        tap((edited: any) => {
          this.store.dispatch(addNewAnswer({
            answer: {
              id: this.afs.createId(),
              questionId: this.question.id,
              courseId: this.question.courseId,
              lessonId: this.question.lessonId,
              answerText: edited.description,
              userDisplayName: this.user.displayName,
              userPictureUrl: this.user.pictureUrl,
              createdAt: firebase.firestore.Timestamp.now()
            }
          }));


          this.openAnswers();

        })
      )
      .subscribe();
  }

  onDeleteAnswer(answer: Answer) {

    const config = new MatDialogConfig();

    config.autoFocus = true;

    config.data = {
      title: 'Delete Answer',
      confirmationText: 'Are you sure you want to delete this answer?'
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, config);

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result.confirm) {
          this.store.dispatch(deleteAnswer({
            courseId: this.question.courseId,
            questionId: this.question.id,
            answerId: answer.id
          }));
        }
      });
  }


  onEditAnswer(answer: Answer) {
    const editorConfig = fullOptionsEditorConfig();

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '710px';
    dialogConfig.data = {
      showTitle:false,
      description: answer.answerText,
      dialogTitle: 'Edit Answer',
      descriptionPlaceholder: 'Type here your answer...',
      editorConfig
    };

    this.dialog.open(EditTitleDescriptionDialogComponent, dialogConfig)
      .afterClosed()
      .pipe(
        filter(edited => !!edited),
        tap((edited: any) => {
          this.store.dispatch(editAnswer({
            courseId: this.question.courseId,
            lessonId: this.question.lessonId,
            questionId: this.question.id,
            update: {
              id: answer.id,
              changes: {
                answerText: edited.description
              }
            }
          }));
        })
      )
      .subscribe();
  }

  goToLesson() {

    this.lessonsDB.findLessonById(this.question.courseId, this.question.lessonId)
      .subscribe(lesson => {
        this.store.dispatch(navigateToLesson({
          courseId: this.question.courseId,
          sectionId: lesson.sectionId,
          seqNo: lesson.seqNo
        }));
      });

  }

}
