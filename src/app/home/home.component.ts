import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {EditHomeDialogComponent} from '../edit-home-dialog/edit-home-dialog.component';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private dialog: MatDialog) {

  }

  ngOnInit() {

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
