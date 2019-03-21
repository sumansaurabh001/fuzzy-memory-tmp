import {FAQ} from './faq.model';
import {HasFaqs} from './has-faqs.model';


export interface SubscriptionContent extends HasFaqs{
  subscriptionBenefits:string;
}
