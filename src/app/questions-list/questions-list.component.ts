import {Component, Input, OnInit} from '@angular/core';
import {Question} from '../models/question.model';
import {Observable} from 'rxjs/internal/Observable';
import {Answer} from '../models/answer.model';
import {of} from 'rxjs';

@Component({
  selector: 'questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss']
})
export class QuestionsListComponent implements OnInit {

  @Input()
  questions: Question[] = [];

  showAnswers = false;

  selectedQuestion: Question;

  answers$: Observable<Answer[]>;


  constructor() { }

  ngOnInit() {

    this.answers$ = of([
      {
        id: '1',
        answer: 'Tensor Flow removed the  .get() from tf.tensor  so for sorting you\'ll have to do:\n' +
          '\n' +
          '.sort((tensorA, tensorB) =>\n' +
          '        tensorA.arraySync()[0] > tensorB.arraySync()[0] ? 1 : -1\n' +
          '    );',
        userDisplayName: "Vasco",
        userPictureUrl: 'https://i.udemycdn.com/user/50x50/11316690_eb0d_3.jpg'
      },
      {
        id: '2',
        answer: 'Tensor Flow removed the  .get() from tf.tensor  so for sorting you\'ll have to do:\n' +
          '\n' +
          '.sort((tensorA, tensorB) =>\n' +
          '        tensorA.arraySync()[0] > tensorB.arraySync()[0] ? 1 : -1\n' +
          '    );',
        userDisplayName: "Vasco",
        userPictureUrl: 'https://i.udemycdn.com/user/50x50/11316690_eb0d_3.jpg'
      },

      {
        id: '3',
        answer: 'Tensor Flow removed the  .get() from tf.tensor  so for sorting you\'ll have to do:\n' +
          '\n' +
          '.sort((tensorA, tensorB) =>\n' +
          '        tensorA.arraySync()[0] > tensorB.arraySync()[0] ? 1 : -1\n' +
          '    );',
        userDisplayName: "Vasco",
        userPictureUrl: 'https://i.udemycdn.com/user/50x50/11316690_eb0d_3.jpg'
      }

    ]);

  }

  goToLecture() {

  }

  openAnswers(question: Question) {

    this.showAnswers = true;

    this.selectedQuestion = question;

  }

  backToQuestions() {

    this.showAnswers = false;

  }


}
