import {Injectable} from '@angular/core';
import {TenantService} from './tenant.service';
import {AngularFirestore} from 'angularfire2/firestore';
import {fromPromise} from 'rxjs/observable/fromPromise';
import {Observable} from 'rxjs/Observable';
import {readDocumentValue} from '../common/firestore-utils';
import {map} from 'rxjs/operators';


@Injectable()
export class DescriptionsDbService {

  private descriptionsPath:string;

  constructor(private afs: AngularFirestore,
              private tenant: TenantService) {

    this.descriptionsPath = this.tenant.path('descriptions');

  }

  findCourseDescription(courseUrl: string): Observable<string> {
    return readDocumentValue<Object>(this.afs.doc(this.descriptionsPath + '/' + courseUrl))
      .pipe(
        map(val => val ? val['description'] : undefined)
      );
  }

  saveDescription(courseUrl:string, description: string): Observable<string> {
    return fromPromise(this.afs.collection(this.descriptionsPath).doc(courseUrl).set({description}))
      .pipe(
        map(() => {
          return description;
        })
      );
  }

}
