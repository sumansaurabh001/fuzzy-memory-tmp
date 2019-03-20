import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {MessagesService} from '../services/messages.service';
import {LoadingService} from '../services/loading.service';
import {Store} from '@ngrx/store';
import {AppState} from '../store';
import {defaultHtmlEditorConfig, defaultEditorConfig} from '../common/html-editor.config';
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
    @Inject(MAT_DIALOG_DATA) data,
    private messages: MessagesService,
    private loading: LoadingService,
    private store: Store<AppState>,
    private contentDb: ContentDbService) {

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

    const saveContent$ = this.contentDb.saveContent(this.savePath, newContent);

    this.loading.showLoaderUntilCompleted(saveContent$)
      .subscribe(
        () => this.dialogRef.close(newContent),
        err => {
          console.log("Could not save new content: ", err);

        }
      );


  }

  close() {
    this.dialogRef.close();
  }


}
