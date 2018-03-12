import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent implements OnInit {

  @Input() height = '300px';

  @Input() placeholder:string;

  @Input() htmlContent:string;



  constructor() {

  }

  ngOnInit() {

  }

}
