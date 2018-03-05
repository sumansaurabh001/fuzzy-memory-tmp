import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TenantService} from './tenant.service';
import {AngularFireStorage} from 'angularfire2/storage';
import {delay, delayWhen, retry, retryWhen, switchMap} from 'rxjs/operators';
import {timer} from 'rxjs/observable/timer';



@Injectable()
export class FileUploadService {

  imagesPath:string;

  constructor(
    private http: HttpClient,
    private tenant: TenantService,
    private storage: AngularFireStorage
  ) {
    this.imagesPath = this.tenant.id + '/course-images'

  }

  uploadFile(image:File) {
    return this.storage.upload(
      this.imagesPath + '/' + image.name, image,
      {
        cacheControl:"max-age=2592000,public",
      })
      .downloadURL()
      .pipe(
        switchMap(() => this.storage.ref(this.imagesPath + '/thumb_' + image.name).getDownloadURL()),
        delay(2000),
        retry(3)
      );
  }

}
