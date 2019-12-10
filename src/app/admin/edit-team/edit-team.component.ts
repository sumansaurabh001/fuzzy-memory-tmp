import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TeamMember} from '../../models/team-member.model';

@Component({
  selector: 'edit-team',
  templateUrl: './edit-team.component.html',
  styleUrls: ['./edit-team.component.scss']
})
export class EditTeamComponent implements OnInit {

  form: FormGroup;

  teamMembers: TeamMember[] = [];

  constructor(private fb:FormBuilder) {


    this.form = fb.group({
      teamMemberEmail: ["", [Validators.required, Validators.email]],
      teamMemberName: [""]
    });

  }

  ngOnInit() {

  }

}
