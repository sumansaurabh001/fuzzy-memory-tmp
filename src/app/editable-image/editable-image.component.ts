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

    this.upload.uploadFile(this.image)
      .subscribe(console.log);
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
