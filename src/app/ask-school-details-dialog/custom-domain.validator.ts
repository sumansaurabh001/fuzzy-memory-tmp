
import {AbstractControl, AsyncValidatorFn} from '@angular/forms';
import {map} from 'rxjs/operators';
import {TenantsDBService} from '../services/tenants-db.service';


export function existingCustomDomainValidator(tenantsDB: TenantsDBService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    return tenantsDB.findCustomSubDomain(control.value)
      .pipe(
        map(customDomain => customDomain ? {customDomainExists: true} : null )
      );
  };
}
