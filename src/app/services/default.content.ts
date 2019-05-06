import {FAQ} from '../models/content/faq.model';

export const DEFAULT_SUBSCRIPTION_BENEFITS = `<ul>
                  <li>Does your employer sponsor online training? Consider requesting a one year or lifetime
                    subscription as a
                    training request (see FAQ below, multiple options available).
                  </li>
                  <li>Free for teachers, discounts available for educational institutions, please email to activate your
                    account.
                  <li>From Brasil, India, elsewhere? Email us to get your fair geographical discount.</li>
                  <li>50% student discount available, simply email us to get your discount.</li>
                </ul>`;



export const DEFAULT_FAQS: FAQ[] = [
  {
    question: 'Can my employer sponsor my subscription?',
    answer: 'Yes, this is available either for a one year request or lifetime access. Please first request your employer permission, then one way is to pay with your own card and either expense the receipt to your employer.'
  },
  {
    question: 'Do I have a money back guarantee?',
    answer: 'Absolutely, if you are not satisfied with our training material we will refund you, just let us know in the next month after the purchase.'
  },
  {
    question: 'Are receipts available?',
    answer: 'Yes, you will receive an automatic email receipt for every transaction successfully billed to the credit card.'
  },
  {
    question: 'What payment methods are available?',
    answer: 'All Credit cards are accepted (via <a href="https://stripe.com">stripe.com</a>). <a href="/contact">Contact us</a> if you have any questions regarding payment.'
  },
  {
    question: 'Do you keep my credit card information?',
    answer: 'No, actually we will never receive the credit card information. Only the payment processing company receives such information.'
  },
  {
    question: 'How does cancellation work?',
    answer: 'You can cancel anytime by using the Cancel Subscription button that will be visible in the top menu. Any issues or questions regarding cancellation please <a href="/contact">contact us</a>.'
  }
];


