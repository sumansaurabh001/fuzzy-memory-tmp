import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {concatMap} from 'rxjs/operators';
import {DescriptionActionTypes} from '../store/description.actions';
import {SaveDescription} from './description.actions';
import {DescriptionsDbService} from '../services/descriptions-db.service';


@Injectable()
export class DescriptionEffects {


  @Effect({dispatch: false})
  saveDescription$ = this.actions$
    .pipe(
      ofType<SaveDescription>(DescriptionActionTypes.SaveDescription),
      concatMap(action => this.descriptionsDB.saveDescription(action.payload.id, action.payload.description))
    );


  constructor(private actions$: Actions,
              private descriptionsDB: DescriptionsDbService) {

  }


}
