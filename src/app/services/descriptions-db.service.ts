import {Injectable} from '@angular/core';
import {TenantService} from './tenant.service';
import {AngularFirestore} from 'angularfire2/firestore';
import {from as fromPromise, Observable} from 'rxjs';
import {readDocumentValue} from '../common/firestore-utils';
import {first, map} from 'rxjs/operators';


@Injectable()
export class DescriptionsDbService {

  constructor(private afs: AngularFirestore,
              private tenant: TenantService) {


  }

  loadDescription(descriptionId: string): Observable<string> {
    return readDocumentValue<Object>(this.afs.doc(this.descriptionsPath + '/' + descriptionId))
      .pipe(
        map(val => val ? val['description'] : undefined),
        first()
      );
  }

  saveDescription(descriptionId:string, description: string): Observable<string> {
    return fromPromise(this.afs.collection(this.descriptionsPath).doc(descriptionId).set({description}))
      .pipe(
        map(() => {
          return description;
        })
      );
  }

  private get descriptionsPath() {
    return this.tenant.path('descriptions');
  }

}
