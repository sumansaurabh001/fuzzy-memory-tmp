import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store';
import {Course} from '../models/course.model';
import {Observable, BehaviorSubject} from 'rxjs';
import {
  isAdmin,
  selectActiveCourse, selectActiveCourseAllLessons, selectActiveCourseDescription,
  selectActiveCourseSections, selectUser, selectUserCoursesIds
} from '../store/selectors';
import {UrlBuilderService} from '../services/url-builder.service';
import {Lesson} from '../models/lesson.model';
import {CourseSection} from '../models/course-section.model';
import {filter, map, startWith, tap, withLatestFrom} from 'rxjs/operators';
import {CollapsibleTriggerComponent} from '../collapsible-trigger/collapsible-trigger.component';
import {sortSectionsBySeqNo} from '../common/sort-model';
import {User} from '../models/user.model';
import {ActivatedRoute} from '@angular/router';
import {MessagesService} from '../services/messages.service';
import {CoursePurchased} from '../store/course.actions';
import {PaymentsService} from '../services/payments.service';
import {PlanActivated} from '../store/user.actions';
import * as firebase from '../subscription/subscription.component';
import {PurchasesService} from '../services/purchases.service';
import {Title} from '@angular/platform-browser';

const DESCRIPTION_MAX_LENGTH = 1500;


@Component({
  selector: 'course',
  templateUrl: './course-page.component.html',
  styleUrls: ['./course-page.component.scss']
})
export class CoursePageComponent implements OnInit {

  course$: Observable<Course>;

  courseDescription$: Observable<string>;

  sections$: Observable<CourseSection[]>;

  lessons$: Observable<Lesson[]>;

  showFullDescription = false;


  constructor(
    private store: Store<AppState>,
    private ub: UrlBuilderService,
    private route:ActivatedRoute,
    private messages:MessagesService,
    private purchases: PurchasesService,
    private title: Title) {

  }

  ngOnInit() {

    this.course$ = this.store
      .pipe(
        select(selectActiveCourse),
        tap(course => this.title.setTitle(course.title))
    );

    this.sections$ = this.store
      .pipe(
        select(selectActiveCourseSections),
        map(sortSectionsBySeqNo)
      );

    this.lessons$ = this.store.pipe(select(selectActiveCourseAllLessons));

    this.courseDescription$ = this.selectDescription();

    this.route.queryParamMap.subscribe(params => {

      const purchaseResult = params.get("purchaseResult");

      if (purchaseResult == "success") {

        const ongoingPurchaseSessionId = params.get("ongoingPurchaseSessionId"),
              courseId = params.get("courseId");

        window.history.replaceState(null, null, window.location.pathname);

        if (purchaseResult == 'success') {
          this.processPurchaseCompletion(ongoingPurchaseSessionId);
        } else if (purchaseResult == 'failure') {
          this.messages.error('Payment failed, please check your card balance.');
        }
      }
      else if (purchaseResult == "failure") {
        this.messages.error('Payment failed, please check your card balance.');
      }

    });

  }

  selectDescription() {
    return this.store
      .pipe(
        select(selectActiveCourseDescription),
        filter(description => !!description),
        map(description => {

          return this.showFullDescription ? description : description.slice(0, description.indexOf('>', DESCRIPTION_MAX_LENGTH));

        })
      );
  }

  thumbnailUrl(course: Course) {
    return this.ub.buildCourseThumbailUrl(course);
  }

  toggleShowMore() {
    this.showFullDescription = true;
    this.courseDescription$ = this.selectDescription();

  }

  processPurchaseCompletion(ongoingPurchaseSessionId:string) {

    this.purchases.waitForPurchaseCompletion(
      ongoingPurchaseSessionId,
      'Payment successful, please enjoy the course!')
      .subscribe(purchaseSession => {

        this.store.dispatch(new CoursePurchased({courseId: purchaseSession.courseId}));

      });

  }


}
