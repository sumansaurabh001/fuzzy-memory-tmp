import { Injectable } from '@angular/core';

@Injectable()
export class TenantService {

  //the tenant Id, on the server it will be taken from the Express request
  id:string;

  constructor() {

    this.id = document.location.hostname;

  }

  path(firesStorePath) {
    return `schools/${this.id}/${firesStorePath}`;
  }

}
