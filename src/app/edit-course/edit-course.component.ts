import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs';
import {UrlBuilderService} from '../services/url-builder.service';
import {selectActiveCourse} from '../store/selectors';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store';
import {CourseCouponsService} from '../coupons-table/course-coupons.service';
import {LoadCoupons} from '../store/coupons.actions';



@Component({
  selector: 'edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    CourseCouponsService
  ]
})
export class EditCourseComponent implements OnInit {

  course$: Observable<Course>;

  selectedIndex = 0;

  couponsLoaded = false;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private ub: UrlBuilderService) {



  }

  ngOnInit() {

    this.course$ = this.store.pipe(select(selectActiveCourse));

  }

  imgSrc(course:Course) {
    return this.ub.buildCourseThumbailUrl(course);
  }

  onTabChange(selectedIndex) {
    this.selectedIndex = selectedIndex;

    if (this.selectedIndex === 2 && !this.couponsLoaded) {
      this.store.dispatch(new LoadCoupons({activeCouponsOnly:true}));
      this.couponsLoaded = true;
    }

  }

  editCourse() {
    this.selectedIndex = 1;
  }

}
