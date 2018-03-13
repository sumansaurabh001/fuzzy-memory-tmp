import {State} from '../store';
import {select, Store} from '@ngrx/store';
import {ActivatedRouteSnapshot} from '@angular/router/src/router_state';
import {Observable} from 'rxjs/Observable';
import {Course} from '../models/course.model';
import {selectAllCourses} from '../store/course.selectors';
import {filter, map} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';


export function findCourseByUrl(store: Store<State>, route: ActivatedRoute): Observable<Course> {

  const courseUrl = route.snapshot.params['courseUrl'];

  return store
    .pipe(
      select(selectAllCourses),
      map(courses => courses.find(course => course.url == courseUrl)),
      filter(course => !!course)
    );
}
