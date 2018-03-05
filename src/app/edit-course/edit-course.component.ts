import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs/Observable';
import {CoursesService} from '../services/courses.service';

@Component({
  selector: 'edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss']
})
export class EditCourseComponent implements OnInit {

  course$: Observable<Course>;

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService) {

    this.course$ = this.coursesService.findCourseByUrl(route.snapshot.params['courseId']);

  }

  ngOnInit() {
  }

}
