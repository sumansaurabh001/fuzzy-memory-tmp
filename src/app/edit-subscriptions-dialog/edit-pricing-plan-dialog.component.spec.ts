import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPricingPlanDialogComponent } from './edit-pricing-plan-dialog.component';

describe('EditPricingPlanDialogComponent', () => {
  let component: EditPricingPlanDialogComponent;
  let fixture: ComponentFixture<EditPricingPlanDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPricingPlanDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPricingPlanDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
