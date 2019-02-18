import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

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

  onAdd(newFeature: string) {
    this.featureAdded.emit(newFeature);
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
