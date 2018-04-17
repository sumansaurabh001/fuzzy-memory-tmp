import { Injectable } from '@angular/core';

@Injectable()
export class TenantService {

  id:string;

  constructor() {

    this.id = document.location.hostname;

  }

  path(firesStorePath) {
    return `schools/${this.id}/${firesStorePath}`;
  }

}
