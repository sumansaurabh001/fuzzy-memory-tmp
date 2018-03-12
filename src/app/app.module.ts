import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';

import {
  MatButtonModule, MatCardModule, MatDatepickerModule, MatDialogModule, MatExpansionModule, MatGridListModule, MatIconModule,
  MatInputModule, MatListModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressSpinnerModule, MatSelectModule,
  MatSidenavModule, MatSlideToggleModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule, MatToolbarModule
} from '@angular/material';

import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {AppRoutingModule} from './app-routing.module';
import {EditCourseComponent} from './edit-course/edit-course.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {EditLessonsListComponent} from './edit-course-lessons/edit-lessons-list.component';
import {EditLessonComponent} from './edit-lesson/edit-lesson.component';
import {FooterComponent} from './footer/footer.component';
import {CoursesComponent} from './courses/courses.component';
import {TopMenuComponent} from './top-menu/top-menu.component';
import {AngularFireModule} from 'angularfire2';
import {environment} from '../environments/environment';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {CourseComponent} from './course/course.component';
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
import {ConfirmationDialogComponent} from './confirmation-dialog/confirmation-dialog.component';
import {TenantService} from './services/tenant.service';
import {CoursesStore} from './services/courses.store';
import {CoursesDBService} from './services/courses-db.service';
import { CourseCardComponent } from './course-card/course-card.component';
import { EditableImageComponent } from './editable-image/editable-image.component';
import {FileUploadService} from './services/file-upload.service';
import {AngularFireStorageModule} from 'angularfire2/storage';
import {CourseResolver} from './services/course.resolver';
import {UrlBuilderService} from './services/url-builder.service';
import {LessonsStore} from './services/lessons.store';
import {LessonsDBService} from './services/lessons-db.service';


@NgModule({
  declarations: [
    AppComponent,
    EditCourseComponent,
    EditLessonsListComponent,
    EditLessonComponent,
    FooterComponent,
    CoursesComponent,
    TopMenuComponent,
    CourseComponent,
    CourseLandingPageComponent,
    EditLessonsToolbarComponent,
    AddCourseDialogComponent,
    MessagesComponent,
    LoadingComponent,
    ActionButtonComponent,
    ConfirmationDialogComponent,
    CourseCardComponent,
    EditableImageComponent
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
    MatMomentDateModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatGridListModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NgxEditorModule,
    MatDialogModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule
  ],
  providers: [
    MessagesService,
    LoadingService,
    TenantService,
    CoursesStore,
    LessonsStore,
    CoursesDBService,
    LessonsDBService,
    FileUploadService,
    CourseResolver,
    UrlBuilderService

  ],
  entryComponents: [
    AddCourseDialogComponent,
    ConfirmationDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
