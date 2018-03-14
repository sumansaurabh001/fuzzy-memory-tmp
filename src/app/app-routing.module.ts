import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EditCourseComponent} from './edit-course/edit-course.component';
import {CoursesComponent} from './courses/courses.component';
import {CourseComponent} from './course/course.component';
import {EditCourseGuard} from './services/edit-course.guard';


const routes: Routes = [
  {
    path: 'courses/:id',
    component: CourseComponent
  },
  {
    path: 'courses/:courseUrl/edit',
    component: EditCourseComponent,
    canActivate:[EditCourseGuard]
  },
  {
    path:'courses',
    component: CoursesComponent
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
