import {Component, Inject, OnInit} from '@angular/core';
import {MessagesService} from '../services/messages.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {defaultEditorConfig} from '../common/html-editor.config';
import {FileUploadService} from '../services/file-upload.service';
import {noop} from 'rxjs';
import {Course} from '../models/course.model';
import {TenantService} from '../services/tenant.service';
import {Observable} from 'rxjs/Observable';
import {AngularFireUploadTask} from '@angular/fire/storage';
import {concatMap, last, map, tap} from 'rxjs/operators';
import {HomePageContent} from '../models/content/home-page-content.model';
import {ContentDbService} from '../services/content-db.service';
import {AppState} from '../store';
import {select, Store} from '@ngrx/store';
import {HomePageContentUpdated} from '../store/content.actions';
import {selectContent} from '../store/content.selectors';
import {deepClone} from '../common/collection-utils';

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

  form: FormGroup;

  editorConfig = defaultEditorConfig;

  bannerUploadTask: AngularFireUploadTask;
  bannerPercentageUpload$: Observable<number>;


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditHomeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private upload: FileUploadService,
    private tenant: TenantService,
    private messages: MessagesService,
    private contentDb: ContentDbService,
    private store: Store<AppState>) {

    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(60)]]
    });

  }

  ngOnInit() {

    this.homePageContent$ = this.store.pipe(select(selectContent('homePage')));

    this.homePageContent$.subscribe(content => this.form.patchValue({title: content.pageTitle}));

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

      this.bannerUploadTask
        .snapshotChanges()
        .pipe(
          last(),
          tap(() => this.messages.info('Home page banner upload completed.')),
          concatMap(() => this.upload.getDownloadUrl(filePath)),
          concatMap(url => {

            const newContent: HomePageContent = deepClone(content);

            newContent.bannerImageUrl = url;

            return this.contentDb.savePageContent('home-page', newContent)
              .pipe(
                map(() => newContent)
              );
          }),
          tap(content => this.store.dispatch(new HomePageContentUpdated({content})))
        )
        .subscribe();

    }

  }

  onBannerCancelUpload() {
    this.bannerUploadTask.cancel();
    this.bannerUploadTask = null;
    this.bannerPercentageUpload$ = null;
  }


  onLogoSelected(event) {

    const logo = event.target.files[0];

    if (logo) {


    }


  }

  imageBasePath() {
    return this.tenant.id + '/content/home';
  }

}
