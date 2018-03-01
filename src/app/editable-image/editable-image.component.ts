import {Component, HostListener, OnInit} from '@angular/core';
import {FileUploadService} from '../services/file-upload.service';
import {HttpEventType} from '@angular/common/http';

@Component({
  selector: 'editable-image',
  templateUrl: './editable-image.component.html',
  styleUrls: ['./editable-image.component.scss']
})
export class EditableImageComponent implements OnInit {

  editMode = false;
  image: File = null;

  constructor(private upload: FileUploadService) {

  }

  ngOnInit() {

  }

  onFileSelected(event) {

    this.image = event.target.files[0];

    this.upload.uploadImage(this.image)
      .subscribe(
        event => {
          if (event.type == HttpEventType.UploadProgress) {
            console.log('Upload progress: ' + Math.round(event.loaded / event.total * 100));
          }
          else if (event.type == HttpEventType.Response) {
            console.log('Upload completed', event);
          }
        }
      );
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
