import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EditCourseComponent} from './edit-course/edit-course.component';
import {CoursesComponent} from './courses/courses.component';
import {CoursePageComponent} from './course-page/course-page.component';
import {WatchCourseComponent} from './watch-course/watch-course.component';
import {LoadCourseDetailResolver} from './services/load-course-detail.resolver';
import {ActiveLessonResolver} from './services/active-lesson.resolver';
import {LoginComponent} from './login/login.component';
import {ViewCoursesResolver} from './services/view-courses.resolver';
import {PlatformGuard} from './services/platform.guard';

const routes: Routes = [
  {
    path: 'courses/:courseUrl',
    component: CoursePageComponent,
    resolve: {
      course: LoadCourseDetailResolver
    },
    canActivate: [PlatformGuard]
  },
  {
    path: 'courses/:courseUrl/:sectionSeqNo/lessons/:lessonSeqNo',
    component: WatchCourseComponent,
    resolve: {
      course: LoadCourseDetailResolver,
      activeLesson: ActiveLessonResolver
    },
    canActivate: [PlatformGuard]
  },
  {
    path: 'courses/:courseUrl/edit',
    component: EditCourseComponent,
    resolve: {
      course: LoadCourseDetailResolver
    },
    canActivate: [PlatformGuard]
  },
  {
    path:'courses',
    component: CoursesComponent,
    resolve: {
      courses: ViewCoursesResolver
    },
    canActivate: [PlatformGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin',
    loadChildren: './admin/admin.module#AdminModule',
    canActivate: [PlatformGuard]
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
