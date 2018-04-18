import {User} from './user.model';


export interface Tenant extends User {

  status: 'new';
  seqNo: number;

}
