import {Component, HostListener, OnInit} from '@angular/core';

@Component({
  selector: 'editable-image',
  templateUrl: './editable-image.component.html',
  styleUrls: ['./editable-image.component.scss']
})
export class EditableImageComponent implements OnInit {

  editMode = false;
  imageFile = null;

  constructor() { }

  ngOnInit() {

  }

  onFileSelected(event) {
    this.imageFile = event.target.files[0];
  }

  uploadImage() {

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
