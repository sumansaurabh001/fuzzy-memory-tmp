import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {UIMessage} from '../../model/ui-message.model';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {map} from 'rxjs/operators';

@Injectable()
export class MessagesService {

  private messagesSubject = new BehaviorSubject<UIMessage[]>([]);

  messages$: Observable<UIMessage[]> = this.messagesSubject.asObservable();

  errors$ = this.filterMessagesPerType('error');
  warnings$ = this.filterMessagesPerType('warn');
  infos$ = this.filterMessagesPerType('info');
  sucesses$ = this.filterMessagesPerType('success');

  constructor() { }

  clear() {
    this.messagesSubject.next([]);
  }

  error(message:string, reason?:string) {
    if (reason) {
      console.log(`${message}, reason: ${reason}`);
    }
    this.showMessagesOfType([message], 'error');
  }

  warn(message:string) {
    this.showMessagesOfType([message], 'warn');
  }

  info(message:string) {
    this.showMessagesOfType([message], 'info');
  }

  success(message:string) {
    this.showMessagesOfType([message], 'success');
  }

  errors(...messages:string[]) {
    this.showMessagesOfType(messages, 'error');
  }

  warns(...messages:string[]) {
    this.showMessagesOfType(messages, 'warn');
  }

  successes(...messages:string[]) {
    this.showMessagesOfType(messages, 'success');
  }

  infos(...messages:string[]) {
    this.showMessagesOfType(messages, 'info');
  }

  private showMessagesOfType(messages:string[], type:string) {
    this.messagesSubject.next(messages.map(message => {return {type, text: message}}));
  }

  private filterMessagesPerType(filteredType:string) {
    return this.messages$.pipe(map(messages => messages.filter(msg => msg.type == filteredType)))
  }

}



