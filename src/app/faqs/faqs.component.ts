import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FAQ} from '../models/content/faq.model';
import {AddFaqEvent, DeleteFaqEvent, EditFaqEvent} from './faq.events';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {EditFaqDialogComponent} from '../edit-faq-dialog/edit-faq-dialog.component';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {concatMap, filter, tap} from 'rxjs/operators';
import {DeleteLesson} from '../store/lesson.actions';

@Component({
  selector: 'faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit {

  @Input()
  faqs: FAQ[];

  @Output()
  faqEdited = new EventEmitter<EditFaqEvent>();

  @Output()
  faqDeleted = new EventEmitter<DeleteFaqEvent>();

  @Output()
  faqAdded = new EventEmitter<AddFaqEvent>();

  constructor(
    private dialog: MatDialog) {

  }

  ngOnInit() {

  }

  onEditFaq(index:number) {

    const dialogConfig = this.setupDialogConfig('Edit FAQ', {...this.faqs[index]});

    this.dialog.open(EditFaqDialogComponent, dialogConfig)
      .afterClosed()
      .pipe(
        filter(faq => !! faq)
      )
      .subscribe(
        (faq:FAQ) => this.faqEdited.emit({faq, index})
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
        () => this.faqDeleted.emit({index})
      );

  }

  onAddFaq() {

    const dialogConfig = this.setupDialogConfig('Add FAQ');

    this.dialog.open(EditFaqDialogComponent, dialogConfig)
      .afterClosed()
      .pipe(
        filter(faq => !! faq)
      )
      .subscribe(
        (faq:FAQ) =>  this.faqAdded.emit({faq})
      );

  }


  setupDialogConfig(dialogTitle:string, faq?:FAQ) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '1000px';
    dialogConfig.data = {
      dialogTitle,
      faq
    };

    return dialogConfig;
  }



}
