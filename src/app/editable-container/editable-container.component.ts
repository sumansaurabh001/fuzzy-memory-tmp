import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'editable-container',
  templateUrl: './editable-container.component.html',
  styleUrls: ['./editable-container.component.scss']
})
export class EditableContainerComponent implements OnInit {

  editMode = false;

  @Output()
  editRequested = new EventEmitter();


  constructor() {

  }

  ngOnInit() {

  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  onEditClicked() {
    this.editRequested.emit();
  }

  containerStyles() {
    if (this.editMode) {
      return {
        opacity:0.5
      }
    }
  }

}
