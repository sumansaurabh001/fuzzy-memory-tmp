import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class FileUploadService {

  constructor(private http: HttpClient) {

  }

  uploadImage(image:File) {

    const fd = new FormData();
    fd.append('image', image, image.name);

    return this.http.post('', fd, {
      reportProgress: true,
      observe: 'events'
    });

  }

}
