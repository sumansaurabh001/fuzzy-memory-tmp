import {Component, Input, OnInit} from '@angular/core';
import {FAQ} from '../models/content/faq.model';

@Component({
  selector: 'faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit {

  @Input()
  faqs: FAQ[];

  constructor() { }

  ngOnInit() {

  }

}
