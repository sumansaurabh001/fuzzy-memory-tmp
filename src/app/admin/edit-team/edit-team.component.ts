import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TeamMember} from '../../models/team-member.model';;
import {AppState} from '../../store';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'edit-team',
  templateUrl: './edit-team.component.html',
  styleUrls: ['./edit-team.component.scss']
})
export class EditTeamComponent implements OnInit {

  unusedLicenses : number;

  form: FormGroup;

  teamMembers: TeamMember[] = [];

  constructor(
    private fb:FormBuilder,
    private route: ActivatedRoute) {

    this.teamMembers = route.snapshot.data["teamMembers"];

    this.unusedLicenses = route.snapshot.data["maxTeamSize"] - this.teamMembers.length;

    this.form = fb.group({
      teamMemberEmail: ["", [Validators.required, Validators.email]],
      teamMemberName: [""]
    });

  }

  ngOnInit() {


  }

}
