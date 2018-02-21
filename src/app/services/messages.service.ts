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

  showError(message:string, reason?:string) {
    if (reason) {
      console.log(`${message}, reason: ${reason}`);
    }
    this.showMessagesOfType([message], 'error');
  }

  showWarn(message:string) {
    this.showMessagesOfType([message], 'warn');
  }

  showInfo(message:string) {
    this.showMessagesOfType([message], 'info');
  }

  showSuccess(message:string) {
    this.showMessagesOfType([message], 'success');
  }

  showErrors(...messages:string[]) {
    this.showMessagesOfType(messages, 'error');
  }

  showWarnings(...messages:string[]) {
    this.showMessagesOfType(messages, 'warn');
  }

  showSuccesses(...messages:string[]) {
    this.showMessagesOfType(messages, 'success');
  }

  showInfos(...messages:string[]) {
    this.showMessagesOfType(messages, 'info');
  }

  private showMessagesOfType(messages:string[], type:string) {
    this.messagesSubject.next(messages.map(message => {return {type, text: message}}));
  }

  private filterMessagesPerType(filteredType:string) {
    return this.messages$.pipe(map(messages => messages.filter(msg => msg.type == filteredType)))
  }

}



