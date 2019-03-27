import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableContainerComponent } from './editable-container.component';

describe('EditableContainerComponent', () => {
  let component: EditableContainerComponent;
  let fixture: ComponentFixture<EditableContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditableContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
