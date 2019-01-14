import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {AppState} from '../store';
import {select, Store} from '@ngrx/store';
import {selectUserPermissions} from '../store/selectors';
import {tap} from 'rxjs/operators';
import {UserPermissions} from '../models/user-permissions.model';


@Directive({
  selector: '[allowRole]'
})
export class AllowRoleDirective {

  private userPermissions: UserPermissions;
  private allowedRoles: string[] = [];

  private visible = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private store: Store<AppState>
  ) {

    store
      .pipe(
        select(selectUserPermissions),
        tap(permissions => {
          this.userPermissions = permissions;
          this.updateVisibility();
        })
      )
      .subscribe();

  }

  @Input()
  set allowRole(allowedRoles: string[]) {
    this.allowedRoles = allowedRoles;
    this.updateVisibility();
  }


  private updateVisibility() {

    const newVisibility = this.userPermissions && this.userPermissions.isAdmin && this.allowedRoles.includes('ADMIN');

    if (newVisibility && !this.visible) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.visible = true;
    }
    else if (!newVisibility && this.visible) {
      this.viewContainer.clear();
      this.visible = false;
    }

  }


}

