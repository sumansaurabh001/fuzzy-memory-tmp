import {Component, Inject, OnInit} from '@angular/core';
import {MessagesService} from '../services/messages.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {defaultEditorConfig, minimalEditorConfig} from '../common/html-editor.config';
import {FileUploadService} from '../services/file-upload.service';
import {noop, throwError} from 'rxjs';
import {Course} from '../models/course.model';
import {TenantService} from '../services/tenant.service';
import {Observable} from 'rxjs/Observable';
import {AngularFireUploadTask} from '@angular/fire/storage';
import {catchError, concatMap, last, map, tap} from 'rxjs/operators';
import {HomePageContent} from '../models/content/home-page-content.model';
import {ContentDbService} from '../services/content-db.service';
import {AppState} from '../store';
import {select, Store} from '@ngrx/store';
import {HomePageContentUpdated} from '../store/content.actions';
import {selectContent} from '../store/content.selectors';
import {deepClone} from '../common/collection-utils';
import * as firebase from 'firebase/app';

@Component({
  selector: 'edit-home-dialog',
  templateUrl: './edit-home-dialog.component.html',
  styleUrls: ['./edit-home-dialog.component.scss'],
  providers: [
    MessagesService
  ]
})
export class EditHomeDialogComponent implements OnInit {

  homePageContent$: Observable<HomePageContent>;

  editorConfig = minimalEditorConfig;

  bannerUploadTask: AngularFireUploadTask;
  bannerPercentageUpload$: Observable<number>;

  logoUploadTask: AngularFireUploadTask;
  logoPercentageUpload$: Observable<number>;


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditHomeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private upload: FileUploadService,
    private tenant: TenantService,
    private messages: MessagesService,
    private contentDb: ContentDbService,
    private store: Store<AppState>) {


  }

  ngOnInit() {

    this.homePageContent$ = this.store.pipe(select(selectContent('homePage')));


  }

  close() {
    this.dialogRef.close();
  }


  onBannerSelected(event, content: HomePageContent) {

    const imageFile = event.target.files[0];

    if (imageFile) {

      const filePath = this.imageBasePath() + '/' + imageFile.name;

      this.bannerUploadTask = this.upload.uploadFile(imageFile, this.imageBasePath());
      this.bannerPercentageUpload$ = this.bannerUploadTask.percentageChanges();

      this.uploadImage(this.bannerUploadTask, filePath, "banner", imageFile.name, content)
        .subscribe();

    }

  }


  onLogoSelected(event, content: HomePageContent) {

    const imageFile = event.target.files[0];

    if (imageFile) {

      const filePath = this.imageBasePath() + '/' + imageFile.name;

      this.logoUploadTask = this.upload.uploadFile(imageFile, this.imageBasePath());
      this.logoPercentageUpload$ = this.logoUploadTask.percentageChanges();

      this.uploadImage(this.logoUploadTask, filePath, "logo", imageFile.name, content)
        .subscribe();

    }

  }

  uploadImage(uploadTask: AngularFireUploadTask, filePath: string, imageId: string, fileName:string, content: HomePageContent):Observable<any> {
    return uploadTask
      .snapshotChanges()
      .pipe(
        last(),
        catchError(err => {
          console.log("Error uploading image, reason: ", err);
          this.messages.error('Could not upload image. File size must be less than 300KB');
          return throwError(err);
        }),
        tap(() => this.messages.info('Image uploaded, applying it now.')),
        concatMap(() => this.upload.getDownloadUrl(filePath)),
        tap(url => {

          const newContent: HomePageContent = deepClone(content);

          newContent[imageId + 'ImageUrl'] = url;
          newContent[imageId + 'FileName'] = fileName;

          this.store.dispatch(new HomePageContentUpdated({content:newContent}));
        })
      );

  }

  onBannerCancelUpload() {
    this.bannerUploadTask.cancel();
    this.bannerUploadTask = null;
    this.bannerPercentageUpload$ = null;
  }

  onLogoCancelUpload() {
    this.logoUploadTask.cancel();
    this.logoUploadTask = null;
    this.logoPercentageUpload$ = null;
  }

  imageBasePath() {
    return `${this.tenant.id}/content/home`;
  }

  onImageDeleted(imageKey:string, content:HomePageContent) {

    const imageUrlProperty = imageKey + 'ImageUrl',
          imageFileNameProperty = imageKey + 'FileName',
          imageFileName = content[imageFileNameProperty];

    this.upload.deleteFile(`${this.tenant.id}/content/home/${imageFileName}`)
      .pipe(
        map(() => {

          const newContent: HomePageContent = deepClone(content);

          delete newContent[imageUrlProperty];
          delete newContent[imageFileNameProperty];

          return newContent;
        }),
        tap(content => this.store.dispatch(new HomePageContentUpdated({content}))),
        tap(() => this.messages.info("Image deleted."))
      )
      .subscribe();

  }


  save() {

    this.close();

  }

}
