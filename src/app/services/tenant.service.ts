import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {filter} from 'rxjs/operators';

@Injectable()
export class TenantService {

  private tenantId:string;

  private subject = new BehaviorSubject<string>(undefined);

  tenantId$:Observable<string> = this.subject.pipe(filter(tenantId => !!tenantId));

  get id() {
    return this.tenantId;
  }

  set id(tenantId:string) {
    this.tenantId = tenantId;
    this.subject.next(tenantId);
  }

  path(firesStorePath) {
    return `schools/${this.id}/${firesStorePath}`;
  }

}
