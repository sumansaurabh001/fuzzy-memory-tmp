import { Injectable } from '@angular/core';
import {Lesson} from '../models/lesson.model';
import {Update} from '@ngrx/entity';
import {HttpClient} from '@angular/common/http';
import {TenantService} from './tenant.service';
import {Observable} from 'rxjs/Observable';
import {HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AngularFireAuth} from '@angular/fire/auth';
import {VideoAccess} from '../models/video-access.model';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  private authJwtToken:string;

  constructor(
    private http:HttpClient,
    private tenant: TenantService,
    private afAuth: AngularFireAuth) {

    afAuth.idToken.subscribe(jwt => this.authJwtToken = jwt);

  }

  loadVideoAccess(courseId:string, lessonId: string): Observable<VideoAccess> {

    const params = new HttpParams()
      .set("tenantId", this.tenant.id)
      .set("courseId", courseId)
      .set("lessonId", lessonId);

    return this.http.get<VideoAccess>(environment.api.videoAccessUrl, {params});
  }

}
