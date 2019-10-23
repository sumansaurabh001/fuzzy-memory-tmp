import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

import algoliasearch from 'algoliasearch/lite';

import {environment} from '../../environments/environment';
import {fromEvent} from 'rxjs/internal/observable/fromEvent';
import {debounceTime, filter, switchMap, tap} from 'rxjs/operators';
import {from} from 'rxjs/internal/observable/from';
import {MatAutocompleteSelectedEvent} from '@angular/material';


@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, AfterViewInit {

  @Input()
  indexName:string;

  @Input()
  placeholder = '';

  @Input()
  width = 'auto';

  @Output()
  optionSelected = new EventEmitter();

  @ViewChild('search', {static:false})
  searchInput: ElementRef;

  searchClient: any;
  index:any;
  searchOptions = [];



  constructor() {

  }

  ngOnInit() {

    this.searchClient = algoliasearch(
      environment.algolia.app_id,
      environment.algolia.search_key
    );

  }

  ngAfterViewInit() {
    fromEvent(this.searchInput.nativeElement, "keyup")
      .pipe(
        debounceTime(200),
        filter(() => this.searchInput.nativeElement.value && this.searchInput.nativeElement.value.length >= 3),
        tap(() => {
          if (!this.index) {
            this.index = this.searchClient.initIndex(this.indexName);
          }
        }),
        switchMap(() => from(this.index.search({query: this.searchInput.nativeElement.value}))),
        tap((results:any) => {
          this.searchOptions = results.hits;
        })
      )
      .subscribe();
  }

  onSearchOptionSelected(event: MatAutocompleteSelectedEvent) {

    this.searchInput.nativeElement.value = '';

    const lesson = event.option.value;

    this.optionSelected.emit(lesson);

  }


}
