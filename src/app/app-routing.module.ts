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
import {AuthGuard} from './services/auth.guard';
import {StripeRedirectPageComponent} from './stripe-redirect-page/stripe-redirect-page.component';
import {LoginGuard} from './login/login.guard';
import {StripeConnectionRequestComponent} from './stripe-connection-request/stripe-connection-request.component';
import {StripeConnectionResponseComponent} from './stripe-connection-response/stripe-connection-response.component';
import {SubscriptionComponent} from './subscription/subscription.component';
import {MyAccountComponent} from './my-account/my-account.component';
import {SubscriptionContentResolver} from './services/subscription-content.resolver';
import {HomeComponent} from './home/home.component';
import {HomePageContentResolver} from './services/home-page-content.resolver';
import {ContactPageComponent} from './contact-page/contact-page.component';

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
    canActivate: [AuthGuard,PlatformGuard]
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
    path: 'subscription',
    component: SubscriptionComponent,
    canActivate: [PlatformGuard],
    resolve: {
      content: SubscriptionContentResolver
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: "stripe-connection-request",
    component: StripeConnectionRequestComponent
  },
  {
    path: "stripe-connection-response",
    component: StripeConnectionResponseComponent
  },

  {
    path: "stripe-redirect",
    component: StripeRedirectPageComponent,
    canActivate: [PlatformGuard]
  },
  {
    path: 'contact',
    component: ContactPageComponent,
    canActivate: [PlatformGuard]
  },
  {
    path: 'admin',
    loadChildren: './admin/admin.module#AdminModule',
    canActivate: [AuthGuard, PlatformGuard]
  },
  {
    path: "user-settings/my-account",
    component: MyAccountComponent,
    canActivate: [PlatformGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [PlatformGuard],
    resolve: {
      content: HomePageContentResolver
    }
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
