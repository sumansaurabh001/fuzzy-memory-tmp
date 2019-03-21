import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFaqDialogComponent } from './edit-faq-dialog.component';

describe('EditFaqDialogComponent', () => {
  let component: EditFaqDialogComponent;
  let fixture: ComponentFixture<EditFaqDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFaqDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFaqDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
