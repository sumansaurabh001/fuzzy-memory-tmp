import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TenantService} from './tenant.service';
import {AngularFireStorage} from 'angularfire2/storage';
import {delay, switchMap} from 'rxjs/operators';



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
        delay(5000),
        switchMap(() => this.storage.ref(this.imagesPath + '/thumb_' + image.name).getDownloadURL())
      );
  }

}
