import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import {TenantsDBService} from '../services/tenants-db.service';
import {existingCustomDomainValidator} from './custom-domain.validator';

@Component({
  selector: 'ask-school-details-dialog',
  templateUrl: './ask-school-details-dialog.component.html',
  styleUrls: ['./ask-school-details-dialog.component.scss']
})
export class AskSchoolDetailsDialogComponent implements OnInit {

  form:FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AskSchoolDetailsDialogComponent>,
    private fb: FormBuilder,
    private tenantDB: TenantsDBService) {

    this.form = fb.group({
      subDomain: ['', [Validators.required, Validators.minLength(10)], [existingCustomDomainValidator(this.tenantDB)]],
      schoolName: ['', [Validators.required, Validators.minLength(10)]]
    });

  }

  ngOnInit() {

  }


  save() {

    const schoolDetails = this.form.value;

    this.dialogRef.close(schoolDetails);

  }

  domainAlreadyExists() {
    return this.form.get('subDomain').errors && this.form.get('subDomain').errors.customDomainExists;
  }
}
