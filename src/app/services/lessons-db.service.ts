import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {fromPromise} from 'rxjs/observable/fromPromise';
import {findUniqueMatchWithId, readCollectionWithIds, readDocumentValue, readDocumentWithId} from '../common/firestore-utils';
import {TenantService} from './tenant.service';
import {filter, first, map, switchMap, tap} from 'rxjs/operators';
import {Course} from '../models/course.model';


@Injectable()
export class LessonsDBService {



  constructor(private afs: AngularFirestore,
              private tenant: TenantService) {



  }


}




