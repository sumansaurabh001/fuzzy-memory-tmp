import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Question} from '../models/question.model';
import {Observable} from 'rxjs/internal/Observable';
import {Answer} from '../models/answer.model';
import {of} from 'rxjs';
import {defaultEditorConfig, fullOptionsEditorConfig} from '../common/html-editor.config';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {EditTitleDescriptionDialogComponent} from '../edit-title-description-dialog/edit-title-description-dialog.component';
import {tap} from 'rxjs/operators';
import {AppState} from '../store';
import {Store} from '@ngrx/store';
import {addNewQuestion} from '../store/questions.actions';
import {User} from '../models/user.model';
import * as firebase from 'firebase/app';
import {AngularFirestore} from '@angular/fire/firestore';


@Component({
  selector: 'questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss']
})
export class QuestionsListComponent implements OnInit, OnChanges {

  @Input()
  courseId: string;

  @Input()
  lessonId: string;

  @Input()
  user: User;

  @Input()
  questions: Question[] = [];

  answersOpened: {[key:string]: boolean} = {};

  constructor(
    private dialog: MatDialog,
    private store: Store<AppState>,
    private afs: AngularFirestore
  ) {

  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    const change = changes['questions'];
    if (change) {
      this.answersOpened = {};
    }

  }

  askNewQuestion() {

    const editorConfig = fullOptionsEditorConfig();

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '710px';
    dialogConfig.data = {
      dialogTitle: 'Ask a New Question',
      titlePlaceHolder: 'Type here the question title...',
      descriptionPlaceholder: 'Type here your question...',
      editorConfig
    };

    this.dialog.open(EditTitleDescriptionDialogComponent, dialogConfig)
      .afterClosed()
      .pipe(
        tap((question: any) => {
          this.store.dispatch(addNewQuestion({
            courseId: this.courseId,
            questionId: this.afs.createId(),
            props: {
              userId: this.user.id,
              lessonId: this.lessonId,
              title: question.title,
              questionText: question.description,
              userDisplayName: this.user.displayName,
              userPictureUrl: this.user.pictureUrl,
              createdAt: firebase.firestore.Timestamp.now(),
              repliesCount: 0
            }
          }));
        })
      )
      .subscribe();

  }

  onAnswersToggled(questionId: string, answersOpened: boolean) {
    this.answersOpened[questionId] = answersOpened;
  }

}
