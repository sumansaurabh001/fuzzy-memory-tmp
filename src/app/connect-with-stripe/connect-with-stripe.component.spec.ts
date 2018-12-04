import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectWithStripeComponent } from './connect-with-stripe.component';

describe('ConnectWithStripeComponent', () => {
  let component: ConnectWithStripeComponent;
  let fixture: ComponentFixture<ConnectWithStripeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectWithStripeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectWithStripeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
