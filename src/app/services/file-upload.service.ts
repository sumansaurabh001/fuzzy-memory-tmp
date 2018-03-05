import { Injectable } from '@angular/core';
import {AngularFireStorage} from 'angularfire2/storage';
import {delay, delayWhen, retry, retryWhen, switchMap, tap} from 'rxjs/operators';
import {timer} from 'rxjs/observable/timer';



@Injectable()
export class FileUploadService {


  constructor(
    private storage: AngularFireStorage
  ) {

  }

  uploadImageThumbnail(image:File, imagePath:string, imageId:string) {

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
        tap(() => console.log('trying to get image thumbnail ...')),
        delay(2000),
        retry(10)
      );
  }

}
