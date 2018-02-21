import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss']
})
export class ActionButtonComponent implements OnInit {

  @Input() text = '';
  @Input() color = 'primary';
  @Input() icon = 'help';

  @Output() click = new EventEmitter();

  constructor() { }

  ngOnInit() {

  }

  onClick() {
    this.click.next();
  }

}
