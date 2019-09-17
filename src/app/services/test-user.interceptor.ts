import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
import {AppState} from '../store';
import {select, Store} from '@ngrx/store';
import {selectUser} from '../store/selectors';
import {User} from '../models/user.model';


@Injectable()
export class TestUserInterceptor  implements HttpInterceptor {

  user:User;

  constructor(private store:Store<AppState>) {

    store
      .pipe(
        select(selectUser)
      )
      .subscribe(user => this.user = user)

  }

  intercept(req: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.user && (req.method == 'POST' || req.method == "PUT" || req.method == "DELETE") ) {
      const cloned = req.clone({
        body: {
          ...req.body,
          testUser: !!this.user.testUser
        }
      });
      return next.handle(cloned);
    }
    else {
      return next.handle(req);
    }

  }

}
