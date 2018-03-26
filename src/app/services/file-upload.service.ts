import { Injectable } from '@angular/core';
import {AngularFireStorage} from 'angularfire2/storage';
import {Observable} from 'rxjs/Observable';
import * as shortid from 'shortid';
import {TenantService} from './tenant.service';


@Injectable()
export class FileUploadService {


  constructor(
    private storage: AngularFireStorage,
    private tenant: TenantService
  ) {

  }

  uploadImageThumbnail(image:File, imagePath:string): Observable<any> {

    const uploadPath = imagePath + '/' + image.name;

    return this.storage.upload(uploadPath, image)
      .percentageChanges();
  }


  uploadVideo(courseId: string, video: File): Observable<any> {

    const prefix = shortid.generate();

    const uploadPath = `${this.tenant.id}/${courseId}/videos/${prefix}-${video.name}`;

    return this.storage.upload(uploadPath, video)
      .percentageChanges();

  }
}
