import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'loading-dialog',
  templateUrl: './loading-dialog.component.html',
  styleUrls: ['./loading-dialog.component.css']
})
export class LoadingDialogComponent implements OnInit {

  message:string;

  constructor(@Inject(MAT_DIALOG_DATA) data) {

    this.message = data.message;

  }

  ngOnInit() {

  }


}
