import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeConnectionResponseComponent } from './stripe-connection-response.component';

describe('StripeConnectionResponseComponent', () => {
  let component: StripeConnectionResponseComponent;
  let fixture: ComponentFixture<StripeConnectionResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StripeConnectionResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StripeConnectionResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
