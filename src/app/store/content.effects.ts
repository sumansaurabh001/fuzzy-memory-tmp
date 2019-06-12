import {Injectable} from '@angular/core';
import {Actions, createEffect, Effect, ofType} from '@ngrx/effects';

import {catchError, concatMap, filter, map, tap, withLatestFrom} from 'rxjs/operators';
import {ActionCreator, select, Store} from '@ngrx/store';
import {AppState} from './index';
import {isContentLoaded} from './content.selectors';
import {ContentDbService} from '../services/content-db.service';
import {throwError} from 'rxjs';
import {MessagesService} from '../services/messages.service';
import {LoadingService} from '../services/loading.service';
import {ContentActions} from './action-types';


@Injectable({
  providedIn: 'root'
})
export class ContentEffects {

  loadSubscriptionContent$ =  this.createLoadContentEffect("subscription", ContentActions.getSubscriptionContent,ContentActions.subscriptionContentLoaded);

  saveSubscriptionContent$ = this.createSaveContentEffect("subscription", ContentActions.subscriptionContentUpdated);

  loadHomePageContent$ = this.createLoadContentEffect("home-page", ContentActions.getHomePageContent, ContentActions.homePageContentLoaded);

  saveHomePageContent$ = this.createSaveContentEffect("home-page", ContentActions.homePageContentUpdated);

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private content: ContentDbService,
    private messages: MessagesService,
    private loading: LoadingService) {

  }


  createLoadContentEffect(contentPath:string, getContentAction: any, contentLoadedAction:any) {
    return  createEffect(() => this.actions$
      .pipe(
        ofType(getContentAction),
        concatMap(() => this.loading.showLoaderUntilCompleted(this.content.loadPageContent(contentPath))),
        map((content) => contentLoadedAction({content})),
        catchError(err => {
          this.messages.error('Could not load content in path:' + contentPath);
          return throwError(err);
        })
      ));
  }

  createSaveContentEffect(saveContentPath:string, updateContentAction: any) {
    return createEffect(() => this.actions$
      .pipe(
        ofType(updateContentAction),
        concatMap((action:any) => this.content.savePageContent(saveContentPath, action.content)),
        catchError(err => {
          this.messages.error('Could not save content in path:' + saveContentPath);
          return throwError(err);
        })
      ),
      {dispatch:false});
  }



}
