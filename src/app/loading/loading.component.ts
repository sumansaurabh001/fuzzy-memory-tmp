import { Component, OnInit } from '@angular/core';
import {LoadingService} from '../services/loading.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  loading$ : Observable<boolean>;

  constructor(private loadingService: LoadingService) {

  }

  ngOnInit() {
    this.loading$ = this.loadingService.loading$;
  }

}
