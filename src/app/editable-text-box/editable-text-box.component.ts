import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SubscriptionContent} from '../models/content/subscription-content.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {EditHtmlDialogComponent} from '../edit-html-dialog/edit-html-dialog.component';
import {filter, tap} from 'rxjs/operators';

@Component({
  selector: 'editable-text-box',
  templateUrl: './editable-text-box.component.html',
  styleUrls: ['./editable-text-box.component.css']
})
export class EditableTextBoxComponent implements OnInit {

  @Input()
  html:string;

  @Input()
  content: any;

  @Input()
  editedProperty:string;

  @Output()
  textEdited = new EventEmitter<string>();

  constructor(private dialog: MatDialog) {

  }

  ngOnInit() {

  }

  editText() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '1000px';
    dialogConfig.data = {
      dialogTitle: 'Edit Subscription Benefits',
      content: this.content,
      editedProperty: this.editedProperty,
      savePath: `content/subscription`
    };

    this.dialog.open(EditHtmlDialogComponent, dialogConfig)
      .afterClosed()
      .pipe(
        filter(content => !!content),
        tap(content => this.textEdited.emit(content))
      )
      .subscribe();
  }

}
