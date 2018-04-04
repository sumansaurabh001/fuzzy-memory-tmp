import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EditCourseComponent} from './edit-course/edit-course.component';
import {CoursesComponent} from './courses/courses.component';
import {CoursePageComponent} from './course-page/course-page.component';
import {ViewCoursesGuard} from './services/view-courses.guard';
import {WatchCourseComponent} from './watch-course/watch-course.component';
import {LoadCourseDetailResolver} from './services/load-course-detail.resolver';
import {ActiveLessonResolver} from './services/active-lesson.resolver';


const routes: Routes = [
  {
    path: 'courses/:courseUrl',
    component: CoursePageComponent,
    resolve: {
      course: LoadCourseDetailResolver
    }
  },
  {
    path: 'courses/:courseUrl/lessons/:lessonSeqNo',
    component: WatchCourseComponent,
    resolve: {
      course: LoadCourseDetailResolver,
      activeLesson: ActiveLessonResolver
    }
  },
  {
    path: 'courses/:courseUrl/edit',
    component: EditCourseComponent,
    resolve: {
      course: LoadCourseDetailResolver
    }
  },
  {
    path:'courses',
    component: CoursesComponent,
    canActivate: [ViewCoursesGuard]
  },
  {
    path: "**",
    redirectTo: '/courses'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
