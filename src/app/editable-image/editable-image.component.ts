import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {FileUploadService} from '../services/file-upload.service';
import {HttpEventType} from '@angular/common/http';
import {LoadingService} from '../services/loading.service';

@Component({
  selector: 'editable-image',
  templateUrl: './editable-image.component.html',
  styleUrls: ['./editable-image.component.scss']
})
export class EditableImageComponent implements OnInit {

  editMode = false;
  image: File = null;

  @Input() src:string;
  @Input() imagePath:string;
  @Input() imageId:string;

  @Output() imageUploaded = new EventEmitter<string>();

  constructor(
    private upload: FileUploadService,
    private loading: LoadingService) {

  }

  ngOnInit() {

  }

  onFileSelected(event) {

    this.image = event.target.files[0];

    if (this.image) {
      this.loading.showLoader(this.upload.uploadImageThumbnail(this.image, this.imagePath, this.imageId))
        .subscribe(url => this.imageUploaded.next(url));
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

}
