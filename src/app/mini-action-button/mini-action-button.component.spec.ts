import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniActionButtonComponent } from './mini-action-button.component';

describe('MiniActionButtonComponent', () => {
  let component: MiniActionButtonComponent;
  let fixture: ComponentFixture<MiniActionButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiniActionButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniActionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
