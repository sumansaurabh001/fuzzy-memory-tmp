import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs/Observable';
import {CoursesService} from '../services/courses.service';
import {UrlBuilderService} from '../services/url-builder.service';


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
    private coursesService: CoursesService,
    private ub: UrlBuilderService) {

    this.course$ = this.coursesService.selectCourseByUrl(route.snapshot.params['courseUrl']);

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
