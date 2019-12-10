import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TeamMember} from '../../models/team-member.model';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../store';
import {Observable} from 'rxjs/internal/Observable';
import {selectMaxTeamSize} from '../../store/selectors';

@Component({
  selector: 'edit-team',
  templateUrl: './edit-team.component.html',
  styleUrls: ['./edit-team.component.scss']
})
export class EditTeamComponent implements OnInit {

  maxTeamSize$ : Observable<number>;

  form: FormGroup;

  teamMembers: TeamMember[] = [];

  constructor(
    private fb:FormBuilder,
    private store: Store<AppState>) {


    this.form = fb.group({
      teamMemberEmail: ["", [Validators.required, Validators.email]],
      teamMemberName: [""]
    });

  }

  ngOnInit() {

    this.maxTeamSize$ = this.store.pipe(select(selectMaxTeamSize));

  }

}
