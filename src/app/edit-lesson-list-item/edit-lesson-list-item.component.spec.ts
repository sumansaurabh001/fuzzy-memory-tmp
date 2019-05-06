import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLessonListItemComponent } from './edit-lesson-list-item.component';

describe('EditLessonListItemComponent', () => {
  let component: EditLessonListItemComponent;
  let fixture: ComponentFixture<EditLessonListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLessonListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLessonListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
