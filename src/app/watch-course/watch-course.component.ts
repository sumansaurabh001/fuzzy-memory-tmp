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


interface WatchCourseData {
  course: Course;
  sections: CourseSection[];
  lessons: Lesson[];
  activeLesson: Lesson;
  lessonsWatched: string[];
  user: User;
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

    this.data$ = combineLatest(course$, sections$, lessons$, activeLesson$, lessonsWatched$, user$)
      .pipe(
        map(([course, sections, lessons, activeLesson, lessonsWatched, user]) =>
        {
          return {course, sections, lessons, activeLesson, lessonsWatched, user};
        })
      );


    this.lessonData$ = zip(activeLesson$, activeLessonVideoAccess$);


    this.questions$ = of([

      {
        id: '1',
        title: 'Sorting tensors with new TensorFlow js Lib',
        questionText: 'Tensor Flow removed the  .get() from tf.tensor  so for sorting you\'ll have to do:\n' +
          '\n' +
          '.sort((tensorA, tensorB) =>\n' +
          '        tensorA.arraySync()[0] > tensorB.arraySync()[0] ? 1 : -1\n' +
          '    );',
        lessonId: '1',
        courseId: '1',
        userPictureUrl: 'https://i.udemycdn.com/user/50x50/11316690_eb0d_3.jpg',
        userDisplayName: "Vasco",
        repliesCount: 0

      },
      {
        id: '1',
        title: 'Broadcasting Operations Video 3:57',
        questionText: 'Tensor Flow removed the  .get() from tf.tensor  so for sorting you\'ll have to do:\n' +
          '\n' +
          '.sort((tensorA, tensorB) =>\n' +
          '        tensorA.arraySync()[0] > tensorB.arraySync()[0] ? 1 : -1\n' +
          '    );',
        lessonId: '1',
        courseId: '1',
        userPictureUrl: 'https://i.udemycdn.com/user/50x50/11316690_eb0d_3.jpg',
        userDisplayName: "Vasco",
        repliesCount: 10
      },
      {
        id: '1',
        title: 'NAN on normalized table',
        questionText: 'Tensor Flow removed the  .get() from tf.tensor  so for sorting you\'ll have to do:\n' +
          '\n' +
          '.sort((tensorA, tensorB) =>\n' +
          '        tensorA.arraySync()[0] > tensorB.arraySync()[0] ? 1 : -1\n' +
          '    );',
        lessonId: '1',
        courseId: '1',
        userPictureUrl: 'https://i.udemycdn.com/user/50x50/11316690_eb0d_3.jpg',
        userDisplayName: "Vasco",
        repliesCount: 1
      },
      {
        id: '1',
        title: 'Also really low accuracy',
        questionText: 'Tensor Flow removed the  .get() from tf.tensor  so for sorting you\'ll have to do:\n' +
          '\n' +
          '.sort((tensorA, tensorB) =>\n' +
          '        tensorA.arraySync()[0] > tensorB.arraySync()[0] ? 1 : -1\n' +
          '    );',
        lessonId: '1',
        courseId: '1',
        userPictureUrl: 'https://i.udemycdn.com/user/50x50/11316690_eb0d_3.jpg',
        userDisplayName: "Vasco",
        repliesCount: 5
      },
      {
        id: '1',
        title: 'Different results every time runAnalysis with same data.',
        questionText: 'Tensor Flow removed the  .get() from tf.tensor  so for sorting you\'ll have to do:\n' +
          '\n' +
          '.sort((tensorA, tensorB) =>\n' +
          '        tensorA.arraySync()[0] > tensorB.arraySync()[0] ? 1 : -1\n' +
          '    );',
        lessonId: '1',
        courseId: '1',
        userPictureUrl: 'https://i.udemycdn.com/user/50x50/11316690_eb0d_3.jpg',
        userDisplayName: "Vasco",
        repliesCount: 6
      }


    ]);

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

}
