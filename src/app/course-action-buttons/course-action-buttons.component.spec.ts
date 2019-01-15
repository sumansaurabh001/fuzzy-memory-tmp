import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseActionButtonsComponent } from './course-action-buttons.component';

describe('CourseActionButtonsComponent', () => {
  let component: CourseActionButtonsComponent;
  let fixture: ComponentFixture<CourseActionButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseActionButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseActionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
