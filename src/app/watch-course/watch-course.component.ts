import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
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
import {Router} from '@angular/router';
import {filter, map, tap, withLatestFrom} from 'rxjs/operators';
import {sortLessonsBySectionAndSeqNo, sortSectionsBySeqNo} from '../common/sort-model';
import {watchLesson} from '../store/lesson.actions';
import {VideoPlayerComponent} from '../video-player/video-player.component';
import {VideoAccess} from '../models/video-access.model';
import {Title} from '@angular/platform-browser';
import {selectActiveCourseLessonsWatched} from '../store/user-lesson-status.selectors';
import {UserLessonStatus} from '../models/user-lesson-status';
import {updateLessonWatchStatus} from '../store/user-lesson-status.actions';
import {UrlBuilderService} from '../services/url-builder.service';


@Component({
  selector: 'watch-course',
  templateUrl: './watch-course.component.html',
  styleUrls: ['./watch-course.component.scss']

})
export class WatchCourseComponent implements OnInit {

  @ViewChild(VideoPlayerComponent, { static: false })
  videoPlayer: VideoPlayerComponent;

  course$: Observable<Course>;

  sections$: Observable<CourseSection[]>;

  lessons$: Observable<Lesson[]>;

  activeSection$: Observable<CourseSection>;

  activeLesson$: Observable<Lesson>;

  activeLessonVideoAccess$: Observable<VideoAccess>;

  lessonsWatched$: Observable<string[]>;

  leftMenuOpened = true;

  autoPlay = true;

  initialLessonLoaded = false;


  constructor(private store: Store<AppState>,
              private router: Router,
              private title: Title,
              private ub: UrlBuilderService) {

  }


  ngOnInit() {

    const storedAutoplay = localStorage.getItem('autoPlay');

    if (storedAutoplay) {
      this.autoPlay = JSON.parse(storedAutoplay);
    }

    this.course$ = this.store
      .pipe(
        select(selectActiveCourse),
        tap(course => this.title.setTitle(course.title))
      );

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

    this.lessonsWatched$ = this.store.pipe(select(selectActiveCourseLessonsWatched));

  }

  /**
   *
   * prevent scrolling to the bottom of the page on space.
   *
   */

  @HostListener('window:keydown', ['$event'])
  keyEvent(evt: KeyboardEvent) {
    console.log(evt);
    if (evt.code === "Space") {
      console.log("Cancelling scrolling");
      evt.preventDefault();
      return false;
    }
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

        this.store.dispatch(watchLesson({lessonId: nextLesson.id}));
      }

    }
  }

  onVideoWatched(course:Course, activeLesson: Lesson) {

    const userLessonStatus: UserLessonStatus = {
      id: activeLesson.id,
      courseId: course.id,
      watched:true
    };

    this.store.dispatch(updateLessonWatchStatus({userLessonStatus}));

  }


}
