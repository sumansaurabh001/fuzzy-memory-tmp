import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs/Observable';
import {UrlBuilderService} from '../services/url-builder.service';
import {selectAllCourses} from '../store/course.selectors';
import {select, Store} from '@ngrx/store';
import {map} from 'rxjs/operators';
import {State} from '../store';



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

    const courseUrl = this.route.snapshot.params['courseUrl'];

    this.course$ = this.store
      .pipe(
        select(selectAllCourses),
        map(courses => courses.find(course => course.url == courseUrl))
      );

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
