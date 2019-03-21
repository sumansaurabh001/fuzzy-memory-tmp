import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {MessagesService} from '../services/messages.service';
import {LoadingService} from '../services/loading.service';
import {Store} from '@ngrx/store';
import {AppState} from '../store';
import {defaultEditorConfig} from '../common/html-editor.config';
import {ContentDbService} from '../services/content-db.service';

@Component({
  selector: 'edit-html-dialog',
  templateUrl: './edit-html-dialog.component.html',
  styleUrls: ['./edit-html-dialog.component.scss'],
  providers: [MessagesService]
})
export class EditHtmlDialogComponent implements OnInit {

  dialogTitle:string;
  content:any;
  editedProperty:string;
  savePath:string;

  html:string;

  editorConfig = defaultEditorConfig;



  constructor(
    private dialogRef: MatDialogRef<EditHtmlDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.dialogTitle = data.dialogTitle;
    this.content = data.content;
    this.editedProperty = data.editedProperty;
    this.savePath = data.savePath;

    this.html = this.content[this.editedProperty];

  }

  ngOnInit() {



  }

  save() {

    const newContent = {...this.content};

    newContent[this.editedProperty] = this.html;

    this.dialogRef.close(newContent);

  }

  close() {
    this.dialogRef.close();
  }


}
