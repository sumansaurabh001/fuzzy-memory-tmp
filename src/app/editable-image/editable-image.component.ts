import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {FileUploadService} from '../services/file-upload.service';
import {HttpEventType} from '@angular/common/http';
import {LoadingService} from '../services/loading.service';
import {EMPTY_IMG} from '../common/ui-constants';

@Component({
  selector: 'editable-image',
  templateUrl: './editable-image.component.html',
  styleUrls: ['./editable-image.component.scss']
})
export class EditableImageComponent implements OnInit {

  editMode = false;

  @Input() src;
  @Input() imagePath:string;

  @Output() imageUploaded = new EventEmitter<string>();

  constructor(
    private upload: FileUploadService,
    private loading: LoadingService) {

  }

  ngOnInit() {

  }

  onFileSelected(event) {

    const image = event.target.files[0];

    if (image) {
      this.upload.uploadImageThumbnail(image, this.imagePath)
        .subscribe(percent => console.log("percentage:",percent));
    }

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

  imgSrc() {
    return this.src || EMPTY_IMG;
  }

}
