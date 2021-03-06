import {select, Store} from '@ngrx/store';
import {AppState} from '../store';
import {selectContentState} from '../store/content.selectors';
import {filter, first, tap} from 'rxjs/operators';


export function createContentResolver(store:Store<AppState>, contentKey:string, getContentAction:Function) {
  return store
    .pipe(
      select(selectContentState),
      tap(state => {
        if (!state[contentKey].loaded) {
          store.dispatch(getContentAction());
        }
      }),
      filter(state => state[contentKey].loaded),
      first()
    );

}
