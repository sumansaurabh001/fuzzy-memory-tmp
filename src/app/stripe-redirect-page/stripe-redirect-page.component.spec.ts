import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeRedirectPageComponent } from './stripe-redirect-page.component';

describe('StripeRedirectPageComponent', () => {
  let component: StripeRedirectPageComponent;
  let fixture: ComponentFixture<StripeRedirectPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StripeRedirectPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StripeRedirectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
