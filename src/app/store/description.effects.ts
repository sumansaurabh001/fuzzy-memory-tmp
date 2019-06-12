import {Injectable} from '@angular/core';
import {Actions, createEffect, Effect, ofType} from '@ngrx/effects';
import {catchError, concatMap, filter, withLatestFrom} from 'rxjs/operators';
import {addDescription, loadDescription, saveDescription} from './description.actions';
import {DescriptionsDbService} from '../services/descriptions-db.service';

import {select, Store} from '@ngrx/store';
import {selectDescriptionsState} from './selectors';
import {AppState} from './index';
import {LoadingService} from '../services/loading.service';
import {MessagesService} from '../services/messages.service';
import {throwError} from 'rxjs';
import {DescriptionActions} from './action-types';
import {create} from 'domain';


@Injectable()
export class DescriptionEffects {

  loadDescriptionIfNeeded$ = createEffect(() => this.actions$
    .pipe(
      ofType(DescriptionActions.loadDescription),
      withLatestFrom(this.store.pipe(select(selectDescriptionsState))),
      filter(([action, descriptions]) => !(action.descriptionId in descriptions)),
      concatMap(
        ([action]) => this.loading.showLoader(this.descriptionsDB.loadDescription(action.descriptionId)),
        ([action], description) => addDescription({id: action.descriptionId, description})
      ),
      catchError(err => {
        this.messages.error('Could not load description.');
        return throwError(err);
      })
    ));




  saveDescription$ = createEffect(() => this.actions$
    .pipe(
      ofType(DescriptionActions.saveDescription),
      concatMap(action => this.descriptionsDB.saveDescription(action.id, action.description)),
      catchError(err => {
        this.messages.error('Could not save description.');
        return throwError(err);
      })
    ),
    {dispatch:false});


  constructor(private actions$: Actions,
              private store : Store<AppState>,
              private loading: LoadingService,
              private descriptionsDB: DescriptionsDbService,
              private messages: MessagesService) {

  }


}
