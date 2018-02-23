import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EditCourseComponent} from './edit-course/edit-course.component';
import {CoursesComponent} from './courses/courses.component';
import {CourseComponent} from './course/course.component';
import {CourseResolver} from './services/course.resolver';


const routes: Routes = [
  {
    path: 'courses/:id',
    component: CourseComponent
  },
  {
    path: 'courses/:id/edit',
    component: EditCourseComponent,
    resolve: {
      course: CourseResolver
    }
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
