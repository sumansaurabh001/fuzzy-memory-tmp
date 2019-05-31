import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, concatMap, filter, withLatestFrom} from 'rxjs/operators';
import {DescriptionActionTypes} from '../store/description.actions';
import {AddDescription, LoadDescription, SaveDescription} from './description.actions';
import {DescriptionsDbService} from '../services/descriptions-db.service';
import {CourseActionTypes, LoadCourseDetail} from './course.actions';
import {select, Store} from '@ngrx/store';
import {selectDescriptionsState} from './selectors';
import {AppState} from './index';
import {LoadingService} from '../services/loading.service';
import {MessagesService} from '../services/messages.service';
import {throwError} from 'rxjs';


@Injectable()
export class DescriptionEffects {

  @Effect()
  loadDescriptionIfNeeded$ = this.actions$
    .pipe(
      ofType<LoadDescription>(DescriptionActionTypes.LoadDescription),
      withLatestFrom(this.store.pipe(select(selectDescriptionsState))),
      filter(([action, descriptions]) => !(action.descriptionId in descriptions)),
      concatMap(
        ([action]) => this.loading.showLoader(this.descriptionsDB.loadDescription(action.descriptionId)),
        ([action], description) => new AddDescription({id: action.descriptionId, description})
      ),
      catchError(err => {
        this.messages.error('Could not load description.');
        return throwError(err);
      })
    );



  @Effect({dispatch: false})
  saveDescription$ = this.actions$
    .pipe(
      ofType<SaveDescription>(DescriptionActionTypes.SaveDescription),
      concatMap(action => this.descriptionsDB.saveDescription(action.payload.id, action.payload.description)),
      catchError(err => {
        this.messages.error('Could not save description.');
        return throwError(err);
      })
    );


  constructor(private actions$: Actions,
              private store : Store<AppState>,
              private loading: LoadingService,
              private descriptionsDB: DescriptionsDbService,
              private messages: MessagesService) {

  }


}
