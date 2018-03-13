import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs/Observable';
import {UrlBuilderService} from '../services/url-builder.service';
import {selectAllCourses} from '../store/course.selectors';
import {select, Store} from '@ngrx/store';
import {map} from 'rxjs/operators';
import {State} from '../store';
import {findCourseByUrl} from '../common/router-utils';



@Component({
  selector: 'edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss']
})
export class EditCourseComponent implements OnInit {

  course$: Observable<Course>;

  selectedIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private store: Store<State>,
    private ub: UrlBuilderService) {

    this.course$ = findCourseByUrl(this.store, this.route);

  }

  ngOnInit() {

  }

  imgSrc(course:Course) {
    return this.ub.buildThumbailUrl(course);
  }

  onTabChange(selectedIndex) {
    this.selectedIndex = selectedIndex;
  }

  editCourse() {
    this.selectedIndex = 1;
  }

}
