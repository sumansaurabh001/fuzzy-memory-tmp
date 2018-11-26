import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponsTableComponent } from './coupons-table.component';

describe('CouponsTableComponent', () => {
  let component: CouponsTableComponent;
  let fixture: ComponentFixture<CouponsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
