import {Injectable} from '@angular/core';
import {TenantService} from './tenant.service';
import {Course} from '../models/course.model';
import {EMPTY_IMG} from '../common/ui-constants';

@Injectable()
export class UrlBuilderService {

  constructor(private tenant: TenantService) {

  }

  buildThumbailUrl(course: Course) {
    if (course && course.thumbnail) {
      return 'https://firebasestorage.googleapis.com/v0/b/onlinecoursehost-local-dev.appspot.com/o/'
        + this.tenant.id + '%2F' + course.url + '%2Fthumbnail%2F' + course.thumbnail + '?alt=media';
    }
    else {
      return EMPTY_IMG;
    }
  }

}
