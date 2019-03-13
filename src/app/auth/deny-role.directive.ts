import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {AppState} from '../store';
import {select, Store} from '@ngrx/store';
import {selectUserPermissions} from '../store/selectors';
import {tap} from 'rxjs/operators';
import {UserPermissions} from '../models/user-permissions.model';


@Directive({
  selector: '[denyRole]'
})
export class DenyRoleDirective {

  private userPermissions: UserPermissions;
  private deniedRoles: string[] = [];

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
  set denyRole(deniedRoles: string[]) {
    this.deniedRoles = deniedRoles;
    this.updateVisibility();
  }


  private updateVisibility() {

    const denied = this.userPermissions && this.isRoleDenied('isAdmin','ADMIN');

    if (denied && this.visible) {
      this.viewContainer.clear();
      this.visible = false;
    }
    else if (!denied && !this.visible) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.visible = true;
    }

  }

  isRoleDenied(permissionFlagName:string, role:string) {
    return this.userPermissions[permissionFlagName] && this.deniedRoles.includes(role);
  }


}

