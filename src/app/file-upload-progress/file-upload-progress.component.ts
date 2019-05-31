import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs';

@Component({
  selector: 'file-upload-progress',
  templateUrl: './file-upload-progress.component.html',
  styleUrls: ['./file-upload-progress.component.scss']
})
export class FileUploadProgressComponent implements OnInit {

  @Input()
  upload$: Observable<number>;

  @Input()
  width = "500px";

  @Output()
  cancel = new EventEmitter();

  constructor() { }

  ngOnInit() {

  }

  cancelUpload() {
    this.cancel.emit();
  }

  calculateStyles() {
    return {
      width: this.width
    }
  }
}
