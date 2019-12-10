import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'edit-team',
  templateUrl: './edit-team.component.html',
  styleUrls: ['./edit-team.component.scss']
})
export class EditTeamComponent implements OnInit {

  form: FormGroup;

  constructor(private fb:FormBuilder) {


    this.form = fb.group({
      teamMemberEmail: ["", Validators.required],
      teamMemberName: [""]
    });

  }

  ngOnInit() {
  }

}
