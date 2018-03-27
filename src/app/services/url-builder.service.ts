import {Injectable} from '@angular/core';
import {TenantService} from './tenant.service';
import {Course} from '../models/course.model';
import {EMPTY_IMG} from '../common/ui-constants';
import {Lesson} from '../models/lesson.model';

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
      return EMPTY_IMG;
    }
  }



  buildLessonThumbailUrl(course: Course, lesson:Lesson) {
    if (course && lesson && lesson.thumbnail) {
      return 'https://firebasestorage.googleapis.com/v0/b/onlinecoursehost-local-dev.appspot.com/o/'
        + this.tenant.id + '%2F' + course.id + '%2Fvideos%2F' + lesson.id + '%2F' + lesson.thumbnail + '?alt=media';
    }
    else {
      return EMPTY_IMG;
    }
  }

}
