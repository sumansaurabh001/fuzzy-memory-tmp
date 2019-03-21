import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FAQ} from '../models/content/faq.model';
import {AddFaqEvent, DeleteFaqEvent, EditFaqEvent} from './faq.events';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {EditFaqDialogComponent} from '../edit-faq-dialog/edit-faq-dialog.component';

@Component({
  selector: 'faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit {

  @Input()
  faqs: FAQ[];

  @Output()
  editFaq = new EventEmitter<EditFaqEvent>();

  @Output()
  deleteFaq = new EventEmitter<DeleteFaqEvent>();

  @Output()
  addFaq = new EventEmitter<AddFaqEvent>();

  constructor(
    private dialog: MatDialog) {

  }

  ngOnInit() {

  }

  onEditFaq(index:number) {

    const dialogConfig = this.setupDialogConfig('Edit FAQ', {...this.faqs[index]});

    this.dialog.open(EditFaqDialogComponent, dialogConfig);

  }

  onDeleteFaq(index:number) {

  }

  onAddFaq() {

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
