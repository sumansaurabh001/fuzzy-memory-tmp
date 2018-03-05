import { Injectable } from '@angular/core';
import {AngularFireStorage} from 'angularfire2/storage';
import {delay, delayWhen, retry, retryWhen, switchMap} from 'rxjs/operators';
import {timer} from 'rxjs/observable/timer';



@Injectable()
export class FileUploadService {


  constructor(
    private storage: AngularFireStorage
  ) {

  }

  uploadFile(image:File,imagePath:string,  imageId:string) {

    const fileExtension =  image.name.split('.').pop(),
          uploadFileName = imageId + '.' + fileExtension,
          uploadPath = imagePath + '/' + uploadFileName,
          thumbnailPath = imagePath + '/thumb_' + uploadFileName;

    return this.storage.upload(uploadPath, image,
      {
        cacheControl:"max-age=2592000,public",
      })
      .downloadURL()
      .pipe(
        switchMap(() => this.storage.ref(thumbnailPath).getDownloadURL()),
        delay(2000),
        retry(3)
      );
  }

}
