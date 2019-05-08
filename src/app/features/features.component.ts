import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CdkDragSortEvent, moveItemInArray} from '@angular/cdk/drag-drop';

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
  featuresOrderChanged = new EventEmitter<string[]>();

  constructor() {

  }

  ngOnInit() {

  }

  onAdd(input: HTMLInputElement, newFeature: string) {
    this.featureAdded.emit(newFeature);
    input.value = '';
  }

  dropFeature(ddEvent: CdkDragSortEvent) {

    const newFeatures = [...this.features];

    moveItemInArray(newFeatures, ddEvent.previousIndex, ddEvent.currentIndex);

    this.featuresOrderChanged.emit(newFeatures);

  }

  onDelete(index: number) {
    this.featureDeleted.emit(index);
  }

}
