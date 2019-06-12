import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs';
import {UrlBuilderService} from '../services/url-builder.service';
import {selectActiveCourse} from '../store/selectors';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store';
import {loadCoupons} from '../store/coupons.actions';
import {EMPTY_IMG} from '../common/ui-constants';
import {Title} from '@angular/platform-browser';
import {setSchoolNameAsPageTitle} from '../common/seo-utils';



@Component({
  selector: 'edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss']
})
export class EditCourseComponent implements OnInit {

  course$: Observable<Course>;

  selectedIndex = 0;

  couponsLoaded = false;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private ub: UrlBuilderService,
    private title: Title) {



  }

  ngOnInit() {

    this.course$ = this.store.pipe(select(selectActiveCourse));

    setSchoolNameAsPageTitle(this.store, this.title);

  }

  imgSrc(course:Course) {
    if (course && course.thumbnail) {
      return this.ub.buildCourseThumbailUrl(course);
    }
    else return EMPTY_IMG;

  }

  onTabChange(selectedIndex) {
    this.selectedIndex = selectedIndex;

    if (this.selectedIndex === 2 && !this.couponsLoaded) {
      this.store.dispatch(loadCoupons({activeCouponsOnly:true}));
      this.couponsLoaded = true;
    }

  }

  editCourse() {
    this.selectedIndex = 1;
  }

}
