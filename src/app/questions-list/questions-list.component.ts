import {Component, Input, OnInit} from '@angular/core';
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
export class QuestionsListComponent implements OnInit {

  @Input()
  courseId: string;

  @Input()
  lessonId: string;

  @Input()
  user: User;

  @Input()
  questions: Question[] = [];

  showAnswers = false;

  selectedQuestion: Question;

  answers$: Observable<Answer[]>;


  constructor(
    private dialog: MatDialog,
    private store: Store<AppState>,
    private afs: AngularFirestore) {

  }

  ngOnInit() {

    this.answers$ = <any>of([
      {
        id: '1',
        answerText: 'Tensor Flow removed the  .get() from tf.tensor  so for sorting you\'ll have to do:\n' +
          '\n' +
          '.sort((tensorA, tensorB) =>\n' +
          '        tensorA.arraySync()[0] > tensorB.arraySync()[0] ? 1 : -1\n' +
          '    );',
        userDisplayName: 'Vasco',
        userPictureUrl: 'https://i.udemycdn.com/user/50x50/11316690_eb0d_3.jpg'
      },
      {
        id: '2',
        answerText: 'Tensor Flow removed the  .get() from tf.tensor  so for sorting you\'ll have to do:\n' +
          '\n' +
          '.sort((tensorA, tensorB) =>\n' +
          '        tensorA.arraySync()[0] > tensorB.arraySync()[0] ? 1 : -1\n' +
          '    );',
        userDisplayName: 'Vasco',
        userPictureUrl: 'https://i.udemycdn.com/user/50x50/11316690_eb0d_3.jpg'
      },

      {
        id: '3',
        answerText: 'Tensor Flow removed the  .get() from tf.tensor  so for sorting you\'ll have to do:\n' +
          '\n' +
          '.sort((tensorA, tensorB) =>\n' +
          '        tensorA.arraySync()[0] > tensorB.arraySync()[0] ? 1 : -1\n' +
          '    );',
        userDisplayName: 'Vasco',
        userPictureUrl: 'https://i.udemycdn.com/user/50x50/11316690_eb0d_3.jpg'
      }

    ]);

  }

  openAnswers(question: Question) {

    this.showAnswers = true;

    this.selectedQuestion = question;

  }

  backToQuestions() {

    this.showAnswers = false;

  }

  askNewQuestion() {

    const editorConfig = fullOptionsEditorConfig();

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.minWidth = '600px';
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


  addNewAnswer() {

    const editorConfig = fullOptionsEditorConfig();

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.minWidth = '600px';
    dialogConfig.data = {
      dialogTitle: 'Add a New Answer',
      titlePlaceHolder: 'Type here the answer title...',
      descriptionPlaceholder: 'Type here your answer...',
      editorConfig,
      showTitle: false
    };

    this.dialog.open(EditTitleDescriptionDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe();

  }

}
