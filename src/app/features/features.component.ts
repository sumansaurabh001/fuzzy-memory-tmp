import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
const arrayMove = require('array-move');

@Component({
  selector: 'features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit {

  @Input()
  features: string[];

  @Output()
  featureAdded = new EventEmitter<string>();

  @Output()
  featureDeleted = new EventEmitter<number>();

  @Output()
  featureUp = new EventEmitter<number>();

  @Output()
  featureDown = new EventEmitter<number>();

  displayedColumns = ['move', 'description', 'delete'];

  constructor() {

  }

  ngOnInit() {

  }

  onAdd(input: HTMLInputElement, newFeature: string) {
    this.featureAdded.emit(newFeature);
    input.value = '';
  }

  onDelete(index: number) {
    this.featureDeleted.emit(index);
  }

  onMoveUp(index: number) {
    this.featureUp.emit(index);
  }

  onMoveDown(index: number) {
    this.featureDown.emit(index);
  }

}
