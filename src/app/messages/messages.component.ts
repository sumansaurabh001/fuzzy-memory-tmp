import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {MessagesService} from '../services/messages.service';
import {UIMessage} from './ui-message.model';

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesComponent implements OnInit {

  @Input() style: 'normal' | 'dialog' = 'normal';

  constructor(public messages: MessagesService) { }

  ngOnInit() {

  }

  messageType(message: UIMessage) {
    return [
      'messages-' + message.type,
      this.style + '-messages'
    ];
  }

  clearError() {
    this.messages.clear();
  }

}
