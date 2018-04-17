import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {TenantService} from './tenant.service';
import {Injectable} from '@angular/core';
import {of} from 'rxjs/observable/of';


@Injectable()
export class PlatformGuard implements CanActivate {


  constructor(private tenant: TenantService) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>  {

    //TODO
    this.tenant.id = document.location.hostname;

    return of(true);

  }

}
