import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {concatMap, catchError, map} from 'rxjs/operators';
import {LoadingService} from '../services/loading.service';
import {MessagesService} from '../services/messages.service';
import {_throw} from 'rxjs/observable/throw';
import {DescriptionActionTypes, LoadDescription} from '../store/description.actions';
import {AddDescription, SaveDescription} from './description.actions';
import {DescriptionsDbService} from '../services/descriptions-db.service';


@Injectable()
export class DescriptionEffects {

  @Effect()
  loadDescription$ = this.actions$
    .pipe(
      ofType<LoadDescription>(DescriptionActionTypes.LoadDescription),
      concatMap(
        action => this.descriptionsDB.findCourseDescription(action.payload.id),
        (action, description) => {
          return {id: action.payload.id, description};
        }
      ),
      map(payload => new AddDescription(payload)),
      catchError(err => {
        this.messages.error(err);
        return _throw(err);
      })
    );

  @Effect({dispatch: false})
  saveDescription$ = this.actions$
    .pipe(
      ofType<SaveDescription>(DescriptionActionTypes.SaveDescription),
      concatMap(action => this.descriptionsDB.saveDescription(action.payload.id, action.payload.description))
    );


  constructor(private actions$: Actions,
              private descriptionsDB: DescriptionsDbService,
              private loading: LoadingService,
              private messages: MessagesService) {

  }


}
