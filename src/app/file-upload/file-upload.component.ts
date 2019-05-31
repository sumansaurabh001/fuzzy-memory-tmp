import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostBinding, Input, OnInit, Output, ViewChild} from '@angular/core';
import {EMPTY_IMG} from '../common/ui-constants';


@Component({
  selector: 'file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
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

  @Input() allowDelete = false;

  @Output() fileSelected = new EventEmitter();

  @Output() fileDeleted = new EventEmitter();

  @ViewChild("fileUpload", { static: false })
  fileUpload : ElementRef;


  EMPTY_IMG = EMPTY_IMG;

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

    const styles = {
      height: this.height,
      width: this.width,
    };

    if (this.src) {
      styles['background-image'] = `url(${this.src})`;
    }

    return styles;
  }

  onFileSelected($event) {
    this.fileSelected.next($event);
  }


  open() {
    this.fileUpload.nativeElement.click();
  }

  onDelete() {
    this.fileDeleted.emit();
  }

}
