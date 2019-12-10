import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/internal/Observable';
import {TeamMember} from '../../models/team-member.model';
import {EditTeamService} from './edit-team.service';
import {AppState} from '../../store';
import {select, Store} from '@ngrx/store';
import {selectMaxTeamSize, selectUser} from '../../store/selectors';
import {filter, first, map, tap} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';



@Injectable()
export class TeamSizeResolver implements Resolve<number>{

  constructor(private team: EditTeamService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<number> {
    return of(0);
  }




}
