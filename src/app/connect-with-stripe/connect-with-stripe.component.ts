import { Component, OnInit } from '@angular/core';
import {environment} from '../../environments/environment';

@Component({
  selector: 'connect-with-stripe',
  templateUrl: './connect-with-stripe.component.html',
  styleUrls: ['./connect-with-stripe.component.css']
})
export class ConnectWithStripeComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }

  stripeConnectUrl() {

    const stripeHostClientId = environment.stripe.stripeHostClientId;

    return `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${stripeHostClientId}&scope=read_write`;
  }


}
