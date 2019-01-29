import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'mini-action-button',
  templateUrl: './mini-action-button.component.html',
  styleUrls: ['./mini-action-button.component.scss']
})
export class MiniActionButtonComponent implements OnInit {

  @Input()
  icon:string;

  constructor() { }

  ngOnInit() {
  }

}
