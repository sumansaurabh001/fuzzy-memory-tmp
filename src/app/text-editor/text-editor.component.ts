import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent implements OnInit {

  @Input() height = '300px';

  @Input() placeholder;

  toolbar = [
    ['bold', 'italic', 'underline', 'strikeThrough'],
    ['justifyCenter'],
    ['paragraph', 'blockquote', 'removeBlockquote', 'horizontalLine', 'orderedList', 'unorderedList'],
    ['link'],
    ['code']
  ];

  constructor() {

  }

  ngOnInit() {
  }

}
