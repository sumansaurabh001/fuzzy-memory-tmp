import {Injectable} from '@angular/core';
import {TenantService} from './tenant.service';
import {Course} from '../models/course.model';
import {EMPTY_IMG} from '../common/ui-constants';
import {Lesson} from '../models/lesson.model';
import {VideoAccess} from '../models/video-access.model';

@Injectable()
export class UrlBuilderService {

  constructor(private tenant: TenantService) {

  }

  buildCourseThumbailUrl(course: Course) {
    if (course && course.thumbnail) {
      return 'https://firebasestorage.googleapis.com/v0/b/onlinecoursehost-local-dev.appspot.com/o/'
        + this.tenant.id + '%2F' + course.id + '%2Fthumbnail%2F' + course.thumbnail + '?alt=media';
    }
    else {
      return null;
    }
  }



  buildLessonThumbailUrl(course: Course, lesson:Lesson) {
    if (course && lesson && lesson.thumbnail) {
      return 'https://firebasestorage.googleapis.com/v0/b/onlinecoursehost-local-dev.appspot.com/o/'
        + this.tenant.id + '%2F' + course.id + '%2Fvideos%2F' + lesson.id + '%2F' + lesson.thumbnail + '?alt=media';
    }
    else {
      return null;
    }
  }

  buildLessonVideoUrl(course: Course, lesson:Lesson, access: VideoAccess) {
    if (course && lesson && lesson.originalFileName) {
      return 'https://firebasestorage.googleapis.com/v0/b/onlinecoursehost-local-dev.appspot.com/o/'
        + this.tenant.id + '%2F' + course.id + '%2Fvideos%2F' + lesson.id + '%2F' + access.videoSecretFileName + '?alt=media';
    }
    else {
      return null;
    }
  }

}
