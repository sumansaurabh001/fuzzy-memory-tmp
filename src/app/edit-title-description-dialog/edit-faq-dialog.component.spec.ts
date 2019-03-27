import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTitleDescriptionDialogComponent } from './edit-title-description-dialog.component';

describe('EditTitleDescriptionDialogComponent', () => {
  let component: EditTitleDescriptionDialogComponent;
  let fixture: ComponentFixture<EditTitleDescriptionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTitleDescriptionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTitleDescriptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
