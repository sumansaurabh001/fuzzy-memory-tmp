import {FAQ} from '../models/content/faq.model';


export interface EditFaqEvent {
  index: number;
  faq:FAQ;
}



export interface DeleteFaqEvent {
  index:number;
}

export interface AddFaqEvent {
  faq:FAQ;
}
