import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';
import {defer} from 'rxjs/observable/defer';
import {of} from 'rxjs/observable/of';
import {AngularFireAuth} from 'angularfire2/auth';
import {catchError, concatMap, filter, map, tap} from 'rxjs/operators';
import {TenantsDBService} from '../../services/tenants-db.service';


@Injectable()
export class BrandingEffects {


  // @Effect()



  constructor(
    private actions$: Actions,
    private tenantsDB: TenantsDBService) {

  }

}
