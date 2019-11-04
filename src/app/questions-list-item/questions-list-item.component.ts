import {Component, Input, OnInit} from '@angular/core';
import {LessonQuestion} from '../models/lesson-question.model';
import {Question} from '../models/question.model';
import {fullOptionsEditorConfig} from '../common/html-editor.config';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {EditTitleDescriptionDialogComponent} from '../edit-title-description-dialog/edit-title-description-dialog.component';
import {tap} from 'rxjs/operators';
import {addNewQuestion} from '../store/questions.actions';
import {Observable} from 'rxjs/internal/Observable';
import {Answer} from '../models/answer.model';
import {of} from 'rxjs/internal/observable/of';
import {Store} from '@ngrx/store';
import {AppState} from '../store';
import {AngularFirestore} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

import { format } from 'timeago.js';
import {User} from '../models/user.model';



@Component({
  selector: 'questions-list-item',
  templateUrl: './questions-list-item.component.html',
  styleUrls: ['./questions-list-item.component.scss']
})
export class QuestionsListItemComponent implements OnInit {

  @Input()
  question: LessonQuestion;

  @Input()
  user:User;

  showAnswers = false;

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

  }

  backToQuestions() {

    this.showAnswers = false;

  }

  addNewAnswer() {

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
      .subscribe();

  }

  calculateTimeAgo(createdAt: firebase.firestore.Timestamp) {
    return format(createdAt.toMillis());
  }
}
