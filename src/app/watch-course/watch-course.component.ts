import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {Course} from '../models/course.model';
import {Observable, zip, combineLatest} from 'rxjs';
import {
  selectActiveCourse, selectActiveCourseAllLessons, selectActiveCourseSections, selectActiveLesson, selectActiveLessonVideoAccess,
  selectActiveSection, selectUser
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
import {LessonQuestion} from '../models/lesson-question.model';
import {of} from 'rxjs/internal/observable/of';
import {fromArray} from 'rxjs/internal/observable/fromArray';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {EditTitleDescriptionDialogComponent} from '../edit-title-description-dialog/edit-title-description-dialog.component';
import {defaultEditorConfig} from '../common/html-editor.config';
import {User} from '../models/user.model';
import {selectActiveLessonQuestions, selectActiveLessonQuestionsPaginationInfo} from '../store/questions.selectors';
import {loadLessonQuestionsPage} from '../store/questions.actions';
import {PaginationInfo} from '../models/pagination-info.model';
import {highlightCodeBlocks} from '../common/highlightjs-utils';


interface WatchCourseData {
  course: Course;
  sections: CourseSection[];
  lessons: Lesson[];
  activeLesson: Lesson;
  lessonsWatched: string[];
  user: User;
  activeLessonQuestionsPaginationInfo: PaginationInfo;
}


@Component({
  selector: 'watch-course',
  templateUrl: './watch-course.component.html',
  styleUrls: ['./watch-course.component.scss']

})
export class WatchCourseComponent implements OnInit {

  @ViewChild(VideoPlayerComponent, {static: false})
  videoPlayer: VideoPlayerComponent;

  data$: Observable<WatchCourseData>;

  lessonData$: Observable<[Lesson, VideoAccess]>;

  leftMenuOpened = true;

  autoPlay = true;

  initialLessonLoaded = false;

  questions$: Observable<LessonQuestion[]>;

  currentLessonQuestionsOnly = true;

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

    const course$ = this.store
      .pipe(
        select(selectActiveCourse),
        tap(course => this.title.setTitle(course.title))
      );

    const sections$ = this.store.pipe(select(selectActiveCourseSections));

    const lessons$ = this.store
      .pipe(
        select(selectActiveCourseAllLessons),
        withLatestFrom(this.store.pipe(select(selectActiveCourseSections), map(sortSectionsBySeqNo))),
        map(([lessons, sections]) => sortLessonsBySectionAndSeqNo(lessons, sections))
      );

    const activeLesson$ = this.store
      .pipe(
        select(selectActiveLesson)
      );

    const activeLessonVideoAccess$ = this.store
      .pipe(
        select(selectActiveLessonVideoAccess),
        filter(videoAccess => !!videoAccess),
        tap(videoAccess => {

          if (!this.initialLessonLoaded) {
            this.initialLessonLoaded = true;
          } else if (this.autoPlay && this.videoPlayer && videoAccess.status == 'allowed') {
            setTimeout(() => this.videoPlayer.play());
          }
        })
      );

    const lessonsWatched$ = this.store.pipe(select(selectActiveCourseLessonsWatched));

    const user$ = this.store.pipe(select(selectUser));

    const activeLessonQuestionsPaginationInfo$ = this.store.pipe(select(selectActiveLessonQuestionsPaginationInfo));

    this.data$ = combineLatest(
      course$, sections$, lessons$, activeLesson$, lessonsWatched$,
      user$, activeLessonQuestionsPaginationInfo$)
      .pipe(
        map(([course, sections, lessons, activeLesson, lessonsWatched, user, activeLessonQuestionsPaginationInfo]) =>
        {
          return {course, sections, lessons, activeLesson, lessonsWatched, user, activeLessonQuestionsPaginationInfo};
        })
      );

    this.lessonData$ = zip(activeLesson$, activeLessonVideoAccess$);

    this.questions$ = this.store.pipe(
      select(selectActiveLessonQuestions),
      tap(() => {
        highlightCodeBlocks();
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
        this.store.dispatch(watchLesson({lessonId: nextLesson.id}));
      }
    }
  }

  onVideoWatched(course: Course, activeLesson: Lesson) {

    const userLessonStatus: UserLessonStatus = {
      id: activeLesson.id,
      courseId: course.id,
      watched: true
    };

    this.store.dispatch(updateLessonWatchStatus({userLessonStatus}));

  }

  onLoadMore(course:Course, activeLesson: Lesson, activeLessonQuestionsPaginationInfo: PaginationInfo ) {
    if (this.currentLessonQuestionsOnly) {
      this.store.dispatch(loadLessonQuestionsPage({
        courseId: course.id,
        lessonId: activeLesson.id,
        lastTimestampLoaded: activeLessonQuestionsPaginationInfo.lastTimestamp
      }));
    }
  }

  onLessonQuestions() {

    this.currentLessonQuestionsOnly = true;
  }

  onFullCourseQuestions() {

    this.currentLessonQuestionsOnly = false;

  }

}
