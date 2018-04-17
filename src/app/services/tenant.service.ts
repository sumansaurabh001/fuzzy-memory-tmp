import { Injectable } from '@angular/core';

@Injectable()
export class TenantService {

  id:string;

  path(firesStorePath) {
    return `schools/${this.id}/${firesStorePath}`;
  }

}
