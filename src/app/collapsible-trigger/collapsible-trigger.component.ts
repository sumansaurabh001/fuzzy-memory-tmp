import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'collapsible-trigger',
  templateUrl: './collapsible-trigger.component.html',
  styleUrls: ['./collapsible-trigger.component.scss']
})
export class CollapsibleTriggerComponent implements OnInit {

  @Input()
  label:string;

  @Output()
  toggle = new EventEmitter();

  @Input()
  expanded = false;

  constructor() { }

  ngOnInit() {

  }

  togglePanel() {
    this.expanded = !this.expanded;
    this.toggle.next(this.expanded);
  }

}
