import { Component, OnInit } from '@angular/core';
import {MessagesService} from '../services/messages.service';
import {UIMessage} from '../../model/ui-message.model';

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  constructor(public messages: MessagesService) { }

  ngOnInit() {

  }

  messageType(message: UIMessage) {
    return 'messages-' + message.type;
  }

  clearError() {
    this.messages.clear();
  }

}
