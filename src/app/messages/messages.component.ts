import { Component, OnInit } from '@angular/core';
import {MessagesService} from '../services/messages.service';

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {




  constructor(public messages: MessagesService) { }

  ngOnInit() {

  }

  clearErrors() {
    this.messages.clear();
  }

}
