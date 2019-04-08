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

@Component({
  selector: 'edit-home-dialog',
  templateUrl: './edit-home-dialog.component.html',
  styleUrls: ['./edit-home-dialog.component.scss'],
  providers: [
    MessagesService
  ]
})
export class EditHomeDialogComponent implements OnInit {

  form: FormGroup;

  editorConfig = defaultEditorConfig;

  bannerPercentageUpload$: Observable<number>;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditHomeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private upload: FileUploadService,
    private tenant: TenantService) {

    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(60)]]
    });

    this.form.patchValue({title: data.pageTitle});

  }

  ngOnInit() {

  }

  close() {
    this.dialogRef.close();
  }



  onBannerSelected(event) {

    const banner = event.target.files[0];

    if (banner) {

      this.bannerPercentageUpload$ = this.upload.uploadFile(banner, this.imageBasePath());

      this.bannerPercentageUpload$
        .subscribe(
          noop,
          noop,
          () => {

            console.log("File upload completed.");

          }
        );

    }

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
