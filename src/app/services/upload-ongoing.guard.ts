import {ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AppState} from '../store';
import {select, Store} from '@ngrx/store';
import {EditCourseComponent} from '../edit-course/edit-course.component';
import {isLessonUploadOngoing} from '../store/selectors';
import {filter, map, tap} from 'rxjs/operators';
import {MessagesService} from './messages.service';


@Injectable({
  providedIn: 'root'
})
export class UploadOngoingGuard implements CanDeactivate<EditCourseComponent> {

  constructor(
    private store: Store<AppState>,
    private messages: MessagesService) {


  }

  canDeactivate(component: EditCourseComponent,
                currentRoute: ActivatedRouteSnapshot,
                currentState: RouterStateSnapshot,
                nextState?: RouterStateSnapshot): Observable<boolean> {

    return this.store
      .pipe(
        select(isLessonUploadOngoing),
        tap(isUploadOngoing => {
          if (isUploadOngoing) {
            this.messages.info("Please wait until all uploads are completed.");
          }
        }),
        map(isUploadOngoing => !isUploadOngoing)
      );
  }


}
