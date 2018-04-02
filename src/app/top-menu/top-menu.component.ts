import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopMenuComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
