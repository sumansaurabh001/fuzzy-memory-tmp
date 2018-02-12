import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';

import {
  MatButtonModule, MatCardModule, MatDatepickerModule, MatDialogModule, MatExpansionModule, MatIconModule, MatInputModule, MatListModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressSpinnerModule, MatSelectModule,
  MatSidenavModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule, MatToolbarModule
} from '@angular/material';

import {ReactiveFormsModule} from '@angular/forms';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {AppRoutingModule} from './app-routing.module';
import { EditCourseComponent } from './edit-course/edit-course.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { EditCourseLessonsComponent } from './edit-course-lessons/edit-course-lessons.component';


@NgModule({
  declarations: [
    AppComponent,
    EditCourseComponent,
    EditCourseLessonsComponent
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
    ReactiveFormsModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
