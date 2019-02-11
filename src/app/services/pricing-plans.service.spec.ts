import { TestBed } from '@angular/core/testing';

import { PricingPlansService } from './pricing-plans.service';

describe('PricingPlansService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PricingPlansService = TestBed.get(PricingPlansService);
    expect(service).toBeTruthy();
  });
});
