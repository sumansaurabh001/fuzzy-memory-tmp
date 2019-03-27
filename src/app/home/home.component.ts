import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {EditHomeDialogComponent} from '../edit-home-dialog/edit-home-dialog.component';
import {HomePageContent} from '../models/content/home-page-content.model';
import {select, Store} from '@ngrx/store';
import {selectContent} from '../store/content.selectors';
import {Observable} from 'rxjs/Observable';
import {AppState} from '../store';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  homePageContent$: Observable<HomePageContent>;

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog) {

  }

  ngOnInit() {

    this.homePageContent$ = this.store.pipe(select(selectContent("homePage")));

  }

  editPage() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.minWidth = '550px';

    dialogConfig.data = {

    };

    this.dialog.open(EditHomeDialogComponent, dialogConfig);

  }



}
