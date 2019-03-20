import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {SubscriptionContent} from '../models/content/subscription-content.model';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {TenantService} from './tenant.service';
import {first} from 'rxjs/operators';
import {from} from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ContentDbService {

  constructor(
    private afs: AngularFirestore,
    private tenant:TenantService) {

  }

  loadSubscriptionContent() : Observable<SubscriptionContent> {
    return this.afs.doc<SubscriptionContent>(`schools/${this.tenant.id}/content/subscription`)
      .valueChanges()
      .pipe(
        first()
      );
  }

  saveContent(savePath:string, newContent:any): Observable<any> {
    return from(this.afs.doc(`schools/${this.tenant.id}/${savePath}`).update(newContent));
  }



}

