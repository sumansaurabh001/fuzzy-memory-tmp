import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TenantService} from './tenant.service';



@Injectable()
export class FileUploadService {

  constructor(
    private http: HttpClient,
    private tenant: TenantService
  ) {

  }

  uploadImage(image:File) {

    const fd = new FormData();
    fd.append('image', image, image.name);

    return this.http.post(
      'https://onlinecoursehost-local-dev.appspot.com/' + this.tenant.id + 'course-images',
      fd,
      {
        reportProgress: true,
        observe: 'events'
      });

  }

}
