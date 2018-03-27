import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EMPTY_IMG} from '../common/ui-constants';


@Component({
  selector: 'editable-image',
  templateUrl: './editable-image.component.html',
  styleUrls: ['./editable-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditableImageComponent implements OnInit {

  editMode = false;


  @Input() src;
  @Input() imagePath: string;
  @Input() height;
  @Input() width;
  @Input() accept;

  @Output() fileSelected = new EventEmitter();


  constructor() {

  }

  ngOnInit() {

  }

  onMouseEnter() {
    this.editMode = true;
  }

  onMouseLeave() {
    this.editMode = false;
  }

  stateClasses() {
    if (this.editMode) {
      return 'edit-mode';
    }
  }

  styles() {
    return {
      'background-image': 'url(' + this.imgSrc() + ')',
      height: this.height,
      width: this.width,
      'background-size': this.width + ' ' + this.height
    };

  }

  onFileSelected($event) {
    this.fileSelected.next($event);
  }

  fileUploadStyles() {

  }

  imgSrc() {
    return this.src || EMPTY_IMG;
  }

}
