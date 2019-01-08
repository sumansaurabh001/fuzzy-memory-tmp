import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {AppState} from '../store';
import {select, Store} from '@ngrx/store';
import {selectUserPermissions} from '../store/selectors';


@Directive({
  selector: '[allowRole]'
})
export class AllowRoleDirective {

  private userRoles = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private store: Store<AppState>
  ) {

    store
      .pipe(
        select(selectUserPermissions)
        //TODO save user roles, link isAdmin = true to *allowRole=['ADMIN']
      )
      .subscribe();

  }

  @Input()
  set roles(allowedRoles: string[]) {

  }


}

