import {AngularFirestore, QueryFn} from '@angular/fire/firestore';
import {TenantService} from './tenant.service';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {LatestLesson} from '../models/latest-lesson.model';
import {readCollectionWithIds} from '../common/firestore-utils';
import {Course} from '../models/course.model';
import {first, map} from 'rxjs/operators';
import * as firebase from "firebase/app";


const PAGE_SIZE = 10;


@Injectable({
  providedIn: 'root'
})
export class LatestLessonsDbService {

  constructor(private afs: AngularFirestore,
              private tenant: TenantService) {

  }

  loadLatestLessonsPage(pageNumber: number): Observable<LatestLesson[]> {

    const latestLessonsPath = `schools/${this.tenant.id}/latestLessonsView`;

    console.log("Loading page number ", pageNumber);

    const queryFn: QueryFn = ref => {
      let query = ref.orderBy('lastUpdated').limit(PAGE_SIZE);
      return query;
    };

    return readCollectionWithIds(this.afs.collection(latestLessonsPath, queryFn));
  }
}
