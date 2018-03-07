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

  uploadImageThumbnail(image:File, imagePath:string) {

    const uploadPath = imagePath + '/' + image.name;

    return this.storage.upload(uploadPath, image)
      .percentageChanges();
  }

}
