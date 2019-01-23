import {Component, OnInit, ViewChild} from '@angular/core';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs';
import {
  selectActiveCourse, selectActiveCourseAllLessons, selectActiveCourseSections, selectActiveLesson, selectActiveLessonVideoAccess,
  selectActiveSection
} from '../store/selectors';
import {select, Store} from '@ngrx/store';
import {CourseSection} from '../models/course-section.model';
import {Lesson} from '../models/lesson.model';
import {AppState} from '../store';
import {UrlBuilderService} from '../services/url-builder.service';
import {Router} from '@angular/router';
import {filter, map, tap, withLatestFrom} from 'rxjs/operators';
import {sortLessonsBySectionAndSeqNo, sortSectionsBySeqNo} from '../common/sort-model';
import {WatchLesson} from '../store/lesson.actions';
import {VideoPlayerComponent} from '../video-player/video-player.component';
import {VideoAccess} from '../models/video-access.model';


@Component({
  selector: 'watch-course',
  templateUrl: './watch-course.component.html',
  styleUrls: ['./watch-course.component.scss']

})
export class WatchCourseComponent implements OnInit {

  @ViewChild(VideoPlayerComponent)
  videoPlayer: VideoPlayerComponent;

  course$: Observable<Course>;

  sections$: Observable<CourseSection[]>;

  lessons$: Observable<Lesson[]>;

  activeSection$: Observable<CourseSection>;

  activeLesson$: Observable<Lesson>;

  activeLessonVideoAccess$: Observable<VideoAccess>;

  leftMenuOpened = true;

  autoPlay = true;

  initialLessonLoaded = false;


  constructor(private store: Store<AppState>,
              public ub: UrlBuilderService,
              private router: Router) {

  }


  ngOnInit() {

    const storedAutoplay = localStorage.getItem('autoPlay');

    if (storedAutoplay) {
      this.autoPlay = JSON.parse(storedAutoplay);
    }

    this.course$ = this.store.pipe(select(selectActiveCourse));

    this.sections$ = this.store.pipe(select(selectActiveCourseSections));

    this.lessons$ = this.store
      .pipe(
        select(selectActiveCourseAllLessons),
        withLatestFrom(this.store.pipe(select(selectActiveCourseSections), map(sortSectionsBySeqNo))),
        map(([lessons, sections]) => sortLessonsBySectionAndSeqNo(lessons, sections))
      );

    this.activeSection$ = this.store.pipe(select(selectActiveSection));

    this.activeLesson$ = this.store
      .pipe(
        select(selectActiveLesson)
      );

    this.activeLessonVideoAccess$ = this.store
      .pipe(
        select(selectActiveLessonVideoAccess),
        filter(videoAccess => !!videoAccess),
        tap(videoAccess => {

          if (!this.initialLessonLoaded) {
            this.initialLessonLoaded = true;
          }
          else if (this.autoPlay && this.videoPlayer && videoAccess.status == 'allowed') {
            setTimeout(() => this.videoPlayer.play());
          }
        })

        );


  }

  toggleLeftMenu() {
    this.leftMenuOpened = !this.leftMenuOpened;
  }

  onExit(course: Course) {
    this.router.navigate(['/courses', course.url]);
  }

  onAutoPlayChange() {
    localStorage.setItem('autoPlay', JSON.stringify(this.autoPlay));
  }

  onVideoEnded(sortedLessons: Lesson[], activeLesson: Lesson) {

    if (this.autoPlay) {

      const index = sortedLessons.indexOf(activeLesson);

      if (index < sortedLessons.length - 1) {

        const nextLesson = sortedLessons[index + 1];

        this.store.dispatch(new WatchLesson({lessonId: nextLesson.id}));
      }

    }
  }


}
