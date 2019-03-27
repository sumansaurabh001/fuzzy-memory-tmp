import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FAQ} from '../models/content/faq.model';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {EditTitleDescriptionDialogComponent} from '../edit-title-description-dialog/edit-title-description-dialog.component';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {concatMap, filter, tap} from 'rxjs/operators';
import {HasFaqs} from '../models/content/has-faqs.model';

@Component({
  selector: 'faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit {

  @Input()
  editedContent:HasFaqs;

  @Output()
  faqEdited = new EventEmitter<any>();

  @Output()
  faqDeleted = new EventEmitter<any>();

  @Output()
  faqAdded = new EventEmitter<any>();

  constructor(
    private dialog: MatDialog) {

  }

  ngOnInit() {

  }

  onEditFaq(index:number) {

    const dialogConfig = this.setupDialogConfig('Edit FAQ', {...this.editedContent.faqs[index]});

    this.dialog.open(EditTitleDescriptionDialogComponent, dialogConfig)
      .afterClosed()
      .pipe(
        filter(faq => !! faq)
      )
      .subscribe(
        (val) => {

          const newContent = {
            ...this.editedContent,
            faqs: this.editedContent.faqs.slice(0)
          };

          newContent.faqs[index] = {
            question: val.title,
            answer: val.description
          };

          this.faqEdited.emit(newContent)

        }
      );

  }

  onDeleteFaq(index:number) {

    const config = new MatDialogConfig();

    config.autoFocus = true;

    config.data = {
      title: 'Confirm FAQ Deletion',
      confirmationText: 'Are you sure you want to delete this question?'
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, config);

    dialogRef.afterClosed()
      .pipe(
        filter(result => result.confirm),
      )
      .subscribe(
        () => {

          const newContent = {
            ...this.editedContent,
            faqs: this.editedContent.faqs.slice(0)
          };

          newContent.faqs.splice(index, 1);

          this.faqDeleted.emit(newContent);

        }
      );

  }

  onAddFaq() {

    const dialogConfig = this.setupDialogConfig('Add FAQ');

    this.dialog.open(EditTitleDescriptionDialogComponent, dialogConfig)
      .afterClosed()
      .pipe(
        filter(faq => !! faq)
      )
      .subscribe(
        (val) =>  {

          const newContent = {
            ...this.editedContent,
            faqs: this.editedContent.faqs.slice(0)
          };

          newContent.faqs.push({
            question: val.title,
            answer: val.description
          });

          this.faqAdded.emit(newContent);
        }
      );

  }


  setupDialogConfig(dialogTitle:string, faq?:FAQ) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '1000px';
    dialogConfig.data = {
      dialogTitle,
      title: faq ? faq.question: '',
      description: faq? faq.answer: ''
    };

    return dialogConfig;
  }



}
