import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit} from '@angular/core';

@Component({
  selector: 'action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss']
})
export class ActionButtonComponent {

  @Input() text;
  @Input() title;
  @Input() color = 'primary';
  @Input() icon = 'help';

}
