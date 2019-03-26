import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHomeDialogComponent } from './edit-home-dialog.component';

describe('EditHomeDialogComponent', () => {
  let component: EditHomeDialogComponent;
  let fixture: ComponentFixture<EditHomeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditHomeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditHomeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
