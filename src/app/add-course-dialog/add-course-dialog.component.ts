import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'add-course-dialog',
  templateUrl: './add-course-dialog.component.html',
  styleUrls: ['./add-course-dialog.component.scss']
})
export class AddCourseDialogComponent implements OnInit {

  form: FormGroup;

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<AddCourseDialogComponent>) {
  }

  ngOnInit() {

    this.form = this.fb.group({
      title: ["", Validators.required],
    });
  }

  close() {
    this.dialogRef.close();
  }

  save() {

  }

}
