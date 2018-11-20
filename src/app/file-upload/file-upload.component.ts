import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostBinding, Input, OnInit, Output, ViewChild} from '@angular/core';
import {EMPTY_IMG} from '../common/ui-constants';


@Component({
  selector: 'file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileUploadComponent implements OnInit {

  editMode = false;

  @Input() src;
  @Input() imagePath: string;

  @Input()
  @HostBinding('style.height')
  height;

  @Input()
  @HostBinding('style.width')
  width;

  @Input() accept;

  @Input() processing:boolean;

  @Output() fileSelected = new EventEmitter();

  @ViewChild("fileUpload")
  fileUpload : ElementRef;


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

  containerStyles() {
    return {
      height: this.height,
      width: this.width
    };
  }

  editableImageStyles() {
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

  open() {
    this.fileUpload.nativeElement.click();
  }

}
