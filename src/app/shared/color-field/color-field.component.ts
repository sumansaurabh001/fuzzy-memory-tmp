import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ColorPickerDirective} from 'ngx-color-picker';

@Component({
  selector: 'color-field',
  templateUrl: './color-field.component.html',
  styleUrls: ['./color-field.component.scss']
})
export class ColorFieldComponent implements OnInit {

  @Input()
  color:string;

  @Input()
  label = "Choose color";

  @ViewChild('colorPicker', {read: ColorPickerDirective})
  colorPicker: ColorPickerDirective;

  @Output()
  colorEdited = new EventEmitter<string>();

  constructor() {

  }

  ngOnInit() {

  }

  onOpen() {
    this.colorPicker.openDialog();
  }

  onColorChanged() {
    this.colorEdited.emit(this.color);
  }

}
