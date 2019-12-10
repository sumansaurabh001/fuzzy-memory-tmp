import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TeamMember} from '../../models/team-member.model';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../store';
import {Observable} from 'rxjs/internal/Observable';
import {selectMaxTeamSize} from '../../store/selectors';
import {map} from 'rxjs/operators';

@Component({
  selector: 'edit-team',
  templateUrl: './edit-team.component.html',
  styleUrls: ['./edit-team.component.scss']
})
export class EditTeamComponent implements OnInit {

  unusedLicenses$ : Observable<number>;

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

    this.unusedLicenses$ = this.store.pipe(
      select(selectMaxTeamSize),
      map(maxTeamSize => maxTeamSize - this.teamMembers.length)
    );

  }

}
