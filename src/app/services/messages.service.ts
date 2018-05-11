import { Injectable } from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs';
import {UIMessage} from '../messages/ui-message.model';
import {map} from 'rxjs/operators';

@Injectable()
export class MessagesService {

  private messagesSubject = new BehaviorSubject<UIMessage>(null);

  message$: Observable<UIMessage> = this.messagesSubject.asObservable();

  constructor() { }

  clear() {
    this.messagesSubject.next(null);
  }

  error(text:string, reason?:string) {
    if (reason) {
      console.log(`${text}, reason: ${reason}`);
    }
    this.messagesSubject.next({type:'error', text});
  }

  warn(text:string) {
    this.messagesSubject.next({type:'warn', text});
  }

  info(text:string) {
    this.messagesSubject.next({type:'info', text});
  }

  success(text:string) {
    this.messagesSubject.next({type:'success', text});
  }

}



