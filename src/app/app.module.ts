import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';

import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatExpansionModule, MatGridListModule,
  MatIconModule,
  MatInputModule, MatListModule,
  MatMenuModule, MatNativeDateModule,
  MatPaginatorModule, MatProgressBarModule,
  MatProgressSpinnerModule, MatSelectModule,
  MatSidenavModule, MatSliderModule, MatSlideToggleModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule, MatToolbarModule
} from '@angular/material';

import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {AppRoutingModule} from './app-routing.module';
import {EditCourseComponent} from './edit-course/edit-course.component';
import {EditLessonsListComponent} from './edit-lessons-list/edit-lessons-list.component';
import {EditLessonComponent} from './edit-lesson/edit-lesson.component';
import {FooterComponent} from './footer/footer.component';
import {CoursesComponent} from './courses/courses.component';
import {TopMenuComponent} from './top-menu/top-menu.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {CoursePageComponent} from './course-page/course-page.component';
import {CourseLandingPageComponent} from './course-landing-page/course-landing-page.component';
import {EditLessonsToolbarComponent} from './edit-lessons-toolbar/edit-lessons-toolbar.component';
import {NgxEditorModule} from 'ngx-editor';
import {AddCourseDialogComponent} from './add-course-dialog/add-course-dialog.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MessagesService} from './services/messages.service';
import {MessagesComponent} from './messages/messages.component';
import {LoadingComponent} from './loading/loading.component';
import {LoadingService} from './services/loading.service';
import {ActionButtonComponent} from './action-button/action-button.component';
import {TenantService} from './services/tenant.service';
import {CoursesDBService} from './services/courses-db.service';
import { CourseCardComponent } from './course-card/course-card.component';
import {FileUploadService} from './services/file-upload.service';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {UrlBuilderService} from './services/url-builder.service';
import {LessonsDBService} from './services/lessons-db.service';
import { AddSectionDialogComponent } from './add-section-dialog/add-section-dialog.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { CourseEffects } from './store/course.effects';
import {RouterStateSerializer, StoreRouterConnectingModule} from '@ngrx/router-store';
import {DescriptionEffects} from './store/description.effects';
import {DescriptionsDbService} from './services/descriptions-db.service';
import {CustomRouterStateSerializer} from './common/router-store-serializer';
import { AddLessonDialogComponent } from './add-lesson-dialog/add-lesson-dialog.component';
import {DangerDialogComponent} from './danger-dialog/danger-dialog.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import {FileUploadComponent} from './file-upload/file-upload.component';
import { CourseSectionComponent } from './course-section/course-section.component';
import {CourseContentComponent} from './course-content/course-content.component';
import { CollapsiblePanelComponent } from './collapsible-panel/collapsible-panel.component';
import { CollapsibleTriggerComponent } from './collapsible-trigger/collapsible-trigger.component';
import { DurationPipe } from './common/duration.pipe';
import { WatchCourseComponent } from './watch-course/watch-course.component';
import {LoadCourseDetailResolver} from './services/load-course-detail.resolver';
import {ActiveLessonResolver} from './services/active-lesson.resolver';
import { VideoPlayerComponent } from './video-player/video-player.component';
import {EditSectionDialogComponent} from './edit-section-dialog/edit-section-dialog.component';
import { LoginComponent } from './login/login.component';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {TenantsDBService} from './services/tenants-db.service';
import {AuthEffects} from './store/auth.effects';
import {ViewCoursesResolver} from './services/view-courses.resolver';
import {PlatformGuard} from './services/platform.guard';
import {PlatformEffects} from './store/platform.effects';
import {CookieService} from 'ngx-cookie-service';
import { PriceAndCouponsComponent } from './price-and-coupons/price-and-coupons.component';
import { CouponsTableComponent } from './coupons-table/coupons-table.component';
import {AddCouponDialogComponent} from './add-coupon-dialog/add-coupon-dialog.component';
import {TimestampPipe} from './common/timestamp.pipe';
import {CouponEffects} from './store/coupon.effects';
import {GetLinkDialogComponent} from './get-link-dialog/get-link-dialog.component';
import { ConnectWithStripeComponent } from './connect-with-stripe/connect-with-stripe.component';
import { StripeRedirectPageComponent } from './stripe-redirect-page/stripe-redirect-page.component';
import { LoadingDialogComponent } from './loading-dialog/loading-dialog.component';
import {LoginGuard} from './login/login.guard';
import {AllowRoleDirective} from './auth/allow-role.directive';
import { StripeConnectionRequestComponent } from './stripe-connection-request/stripe-connection-request.component';
import { StripeConnectionResponseComponent } from './stripe-connection-response/stripe-connection-response.component';
import { CourseActionButtonsComponent } from './course-action-buttons/course-action-buttons.component';


@NgModule({
  declarations: [
    AppComponent,
    EditCourseComponent,
    EditLessonsListComponent,
    EditLessonComponent,
    FooterComponent,
    CoursesComponent,
    TopMenuComponent,
    CoursePageComponent,
    CourseLandingPageComponent,
    EditLessonsToolbarComponent,
    AddCourseDialogComponent,
    AddCouponDialogComponent,
    MessagesComponent,
    LoadingComponent,
    ActionButtonComponent,
    DangerDialogComponent,
    CourseCardComponent,
    AddSectionDialogComponent,
    AddLessonDialogComponent,
    EditSectionDialogComponent,
    ConfirmationDialogComponent,
    FileUploadComponent,
    CourseSectionComponent,
    CourseContentComponent,
    CollapsiblePanelComponent,
    CollapsibleTriggerComponent,
    DurationPipe,
    TimestampPipe,
    WatchCourseComponent,
    VideoPlayerComponent,
    LoginComponent,
    PriceAndCouponsComponent,
    CouponsTableComponent,
    GetLinkDialogComponent,
    ConnectWithStripeComponent,
    StripeRedirectPageComponent,
    LoadingDialogComponent,
    AllowRoleDirective,
    StripeConnectionRequestComponent,
    StripeConnectionResponseComponent,
    CourseActionButtonsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    AppRoutingModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatGridListModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    NgxEditorModule,
    MatDialogModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([
      CourseEffects,
      DescriptionEffects,
      AuthEffects,
      PlatformEffects,
      CouponEffects
    ]),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router'
    })
  ],
  providers: [
    MessagesService,
    LoadingService,
    TenantService,
    CoursesDBService,
    DescriptionsDbService,
    LessonsDBService,
    TenantsDBService,
    PlatformGuard,
    FileUploadService,
    ViewCoursesResolver,
    LoadCourseDetailResolver,
    ActiveLessonResolver,
    UrlBuilderService,
    LoginGuard,
    CookieService,
    { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer }

  ],
  entryComponents: [
    AddCourseDialogComponent,
    DangerDialogComponent,
    AddSectionDialogComponent,
    AddLessonDialogComponent,
    ConfirmationDialogComponent,
    EditSectionDialogComponent,
    AddCouponDialogComponent,
    GetLinkDialogComponent,
    LoadingDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
