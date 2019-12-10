import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {TenantService} from '../../services/tenant.service';


@Injectable()
export class EditTeamService {


  constructor(
    private afs: AngularFirestore,
    private tenant: TenantService) {

  }

  loadMaxTeamSize() {

  }

  loadTeamMembers() {

  }

}
