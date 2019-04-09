import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Course} from '../models/course.model';
import {EMPTY_IMG} from '../common/ui-constants';
import {UrlBuilderService} from '../services/url-builder.service';

@Component({
  selector: 'course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss']
})
export class CourseCardComponent implements OnInit {

  @Input() course: Course;

  constructor(private ub: UrlBuilderService) { }

  ngOnInit() {
  }

  imgSrc() {
    if (this.course && this.course.thumbnail) {
      return this.ub.buildCourseThumbailUrl(this.course);
    }
    else {
      return EMPTY_IMG;
    }

  }

}
