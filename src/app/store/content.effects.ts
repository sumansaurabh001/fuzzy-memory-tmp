import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {
  ContentActions,
  ContentActionTypes,
  GetSubscriptionContent, HomePageContentLoaded,
  SubscriptionContentLoaded,
  SubscriptionContentUpdated
} from './content.actions';
import {catchError, concatMap, filter, map, tap, withLatestFrom} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {AppState} from './index';
import {isContentLoaded} from './content.selectors';
import {ContentDbService} from '../services/content-db.service';
import {throwError} from 'rxjs';
import {MessagesService} from '../services/messages.service';
import {LoadingService} from '../services/loading.service';


@Injectable({
  providedIn: 'root'
})
export class ContentEffects {

  @Effect()
  loadSubscriptionContent$ = this.createLoadContentEffect("subscription", ContentActionTypes.GetSubscriptionContent, SubscriptionContentLoaded);


  @Effect({dispatch:false})
  saveSubscriptionContent$ = this.createSaveContentEffect("subscription", ContentActionTypes.SubscriptionContentUpdated);

  @Effect()
  loadHomePageContent$ = this.createLoadContentEffect("home-page", ContentActionTypes.GetHomePageContent, HomePageContentLoaded);

  @Effect({dispatch:false})
  saveHomePageContent$ = this.createSaveContentEffect("home-page", ContentActionTypes.HomePageContentUpated);



  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private content: ContentDbService,
    private messages: MessagesService,
    private loading: LoadingService) {

  }


  createLoadContentEffect(contentPath:string, getContentActionType: string, ContentLoadedAction:any) {
    return this.actions$
      .pipe(
        ofType(getContentActionType),
        concatMap(() => this.loading.showLoaderUntilCompleted(this.content.loadPageContent(contentPath))),
        map((content) => new ContentLoadedAction({content})),
        catchError(err => {
          this.messages.error('Could not load content in path:' + contentPath);
          return throwError(err);
        })
      );
  }

  createSaveContentEffect(saveContentPath:string, updateContentActionType: string) {
    return this.actions$
      .pipe(
        ofType(updateContentActionType),
        concatMap((action:any) => this.content.savePageContent(saveContentPath, action.payload.content)),
        catchError(err => {
          this.messages.error('Could not save content in path:' + saveContentPath);
          return throwError(err);
        })
      );
  }



}
