import {Component, Input, OnInit} from '@angular/core';
import {CollapsibleTriggerComponent} from '../collapsible-trigger/collapsible-trigger.component';

@Component({
  selector: 'collapsible-panel',
  templateUrl: './collapsible-panel.component.html',
  styleUrls: ['./collapsible-panel.component.scss']
})
export class CollapsiblePanelComponent implements OnInit {

  @Input()
  trigger: CollapsibleTriggerComponent;

  constructor() { }

  ngOnInit() {
  }

}
