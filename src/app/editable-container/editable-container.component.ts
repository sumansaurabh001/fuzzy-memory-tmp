import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'editable-container',
  templateUrl: './editable-container.component.html',
  styleUrls: ['./editable-container.component.scss']
})
export class EditableContainerComponent implements OnInit {

  editMode = false;

  @Input()
  editModeEnabled = true;

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
    if (this.editMode && this.editModeEnabled) {
      return {
        opacity:0.5
      }
    }
  }

}
