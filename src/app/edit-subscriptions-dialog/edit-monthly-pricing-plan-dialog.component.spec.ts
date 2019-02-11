import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMonthlyPricingPlanDialogComponent } from './edit-monthly-pricing-plan-dialog.component';

describe('EditMonthlyPricingPlanDialogComponent', () => {
  let component: EditMonthlyPricingPlanDialogComponent;
  let fixture: ComponentFixture<EditMonthlyPricingPlanDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMonthlyPricingPlanDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMonthlyPricingPlanDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
