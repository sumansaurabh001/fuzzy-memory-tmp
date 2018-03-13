import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'add-section-dialog',
  templateUrl: './add-section-dialog.component.html',
  styleUrls: ['./add-section-dialog.component.scss']
})
export class AddSectionDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<AddSectionDialogComponent>) {

  }

  ngOnInit() {

  }

  close() {
    this.dialogRef.close();
  }

  save(title:string) {
      this.dialogRef.close({title});
  }

}
