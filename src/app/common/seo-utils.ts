import {AppState} from '../store';
import {Title} from '@angular/platform-browser';
import {select, Store} from '@ngrx/store';
import {selectTenantInfo} from '../store/selectors';
import {tap} from 'rxjs/operators';


export function setSchoolNameAsPageTitle(store: Store<AppState>, title: Title) {
  store
    .pipe(
      select(selectTenantInfo),
      tap(tenantInfo => title.setTitle(tenantInfo.schoolName))
    )
    .subscribe();
}
