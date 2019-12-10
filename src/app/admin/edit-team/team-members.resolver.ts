import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/internal/Observable';
import {TeamMember} from '../../models/team-member.model';
import {EditTeamService} from './edit-team.service';
import {of} from 'rxjs';



@Injectable()
export class TeamMembersResolver implements Resolve<TeamMember[]>{

  constructor(private team: EditTeamService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TeamMember[]> {
    return of([]);
  }




}
