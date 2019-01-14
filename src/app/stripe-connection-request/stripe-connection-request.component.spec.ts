import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeConnectionRequestComponent } from './stripe-connection-request.component';

describe('StripeConnectionRequestComponent', () => {
  let component: StripeConnectionRequestComponent;
  let fixture: ComponentFixture<StripeConnectionRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StripeConnectionRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StripeConnectionRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
