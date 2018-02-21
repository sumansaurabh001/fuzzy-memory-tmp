import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
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
import { EditCourseComponent } from './edit-course/edit-course.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { EditCourseLessonsComponent } from './edit-course-lessons/edit-course-lessons.component';
import { EditLessonComponent } from './edit-lesson/edit-lesson.component';
import { FooterComponent } from './footer/footer.component';
import { CoursesComponent } from './courses/courses.component';
import { TopMenuComponent } from './top-menu/top-menu.component';
import {AngularFireModule} from 'angularfire2';
import { environment } from '../environments/environment';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import { CourseComponent } from './course/course.component';
import { CourseLandingPageComponent } from './course-landing-page/course-landing-page.component';
import { EditLessonsToolbarComponent } from './edit-lessons-toolbar/edit-lessons-toolbar.component';
import { NgxEditorModule } from 'ngx-editor';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { AddCourseDialogComponent } from './add-course-dialog/add-course-dialog.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CoursesService} from './services/courses.service';
import {MessagesService} from './services/messages.service';
import { MessagesComponent } from './messages/messages.component';
import { LoadingComponent } from './loading/loading.component';
import {LoadingService} from './services/loading.service';
import { ActionButtonComponent } from './action-button/action-button.component';


@NgModule({
  declarations: [
    AppComponent,
    EditCourseComponent,
    EditCourseLessonsComponent,
    EditLessonComponent,
    FooterComponent,
    CoursesComponent,
    TopMenuComponent,
    CourseComponent,
    CourseLandingPageComponent,
    EditLessonsToolbarComponent,
    TextEditorComponent,
    AddCourseDialogComponent,
    MessagesComponent,
    LoadingComponent,
    ActionButtonComponent
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
    ReactiveFormsModule,
    NgxEditorModule,
    MatDialogModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule
  ],
  providers: [
    CoursesService,
    MessagesService,
    LoadingService
  ],
  entryComponents: [AddCourseDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
