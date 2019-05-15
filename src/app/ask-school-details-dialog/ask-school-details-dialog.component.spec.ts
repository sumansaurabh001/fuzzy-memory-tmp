import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AskSchoolDetailsDialogComponent } from './ask-school-details-dialog.component';

describe('AskSchoolDetailsDialogComponent', () => {
  let component: AskSchoolDetailsDialogComponent;
  let fixture: ComponentFixture<AskSchoolDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AskSchoolDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AskSchoolDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
