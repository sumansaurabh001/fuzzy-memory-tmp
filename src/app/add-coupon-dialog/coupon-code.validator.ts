import {CourseCouponsDbService} from '../services/course-coupons-db.service';
import {AbstractControl, AsyncValidatorFn} from '@angular/forms';
import {map, tap} from 'rxjs/operators';


export function existingCouponCodeValidator(couponsDB: CourseCouponsDbService, courseId: string): AsyncValidatorFn {
  return (control: AbstractControl) => {
    return couponsDB.findCouponByCode(courseId, control.value)
      .pipe(
        map(coupon => coupon ? {codeExists: true} : null )
      );
  };
}




