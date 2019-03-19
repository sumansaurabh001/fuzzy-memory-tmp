import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {ContentActions, ContentActionTypes, GetSubscriptionContent, SubscriptionContentLoaded} from './content.actions';
import {catchError, concatMap, filter, map, withLatestFrom} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {AppState} from './index';
import {isSubscriptionContentLoaded} from './content.selectors';
import {ContentDbService} from '../services/content-db.service';
import {throwError} from 'rxjs';
import {MessagesService} from '../services/messages.service';


@Injectable({
  providedIn: 'root'
})
export class ContentEffects {

  @Effect()
  loadSubscriptionContent$ = this.actions$
    .pipe(
      ofType<GetSubscriptionContent>(ContentActionTypes.GetSubscriptionContent),
      concatMap(() => this.content.loadSubscriptionContent()),
      map((subscriptionContent) => new SubscriptionContentLoaded({subscriptionContent})),
      catchError(err => {
        this.messages.error('Could not load subscription content.');
        return throwError(err);
      })
    );


  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private content: ContentDbService,
    private messages: MessagesService) {

  }

}
