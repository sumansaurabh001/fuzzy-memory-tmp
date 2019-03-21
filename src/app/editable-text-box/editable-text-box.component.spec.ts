import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableTextBoxComponent } from './editable-text-box.component';

describe('EditableTextBoxComponent', () => {
  let component: EditableTextBoxComponent;
  let fixture: ComponentFixture<EditableTextBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditableTextBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableTextBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
