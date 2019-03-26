import { Component, OnInit } from '@angular/core';
import {MessagesService} from '../services/messages.service';

@Component({
  selector: 'edit-home-dialog',
  templateUrl: './edit-home-dialog.component.html',
  styleUrls: ['./edit-home-dialog.component.scss'],
  providers: [
    MessagesService
  ]
})
export class EditHomeDialogComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }

}
