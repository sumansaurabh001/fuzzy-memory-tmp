import { Injectable } from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {TenantService} from './tenant.service';
import {generateId} from '../common/unique-id-generator';
import {AngularFireUploadTask} from '@angular/fire/storage/task';


const CACHE_CONTROL_SETTINGS= 'public,max-age=25920000, s-maxage=25920000';

@Injectable()
export class FileUploadService {

  constructor(
    private storage: AngularFireStorage,
    private tenant: TenantService
  ) {

  }

  uploadFile(file:File, filePath:string, randomFileName = false, addThumbPrefix = false): AngularFireUploadTask {

    let uploadPath;

    if (addThumbPrefix) {
      uploadPath = filePath + '/thumb_' + file.name;
    }
    else {
      uploadPath = filePath + '/' + file.name;
    }

    if (randomFileName) {

      const extension = file.name.split('.').pop();

      uploadPath = uploadPath.replace(extension, generateId() + "." + extension);

    }

    return this.storage.upload(uploadPath, file, {cacheControl: CACHE_CONTROL_SETTINGS});
  }


  uploadVideo(courseId: string, lessonId:string, video: File): AngularFireUploadTask {

    const prefix = generateId();

    const uploadPath = `${this.tenant.id}/${courseId}/videos/${lessonId}/${prefix}-${video.name}`;

    return this.storage.upload(
      uploadPath,
      video, {
      cacheControl:CACHE_CONTROL_SETTINGS,
        contentDisposition: `attachment; filename=${video.name};`
      });

  }

  getDownloadUrl(filePath:string): Observable<string> {
     return this.storage.ref(filePath).getDownloadURL();
  }

  deleteFile(filePath:string) {
    return this.storage.ref(filePath).delete();
  }

}
