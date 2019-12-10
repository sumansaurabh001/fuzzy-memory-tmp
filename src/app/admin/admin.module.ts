import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { BrandingComponent } from './branding/branding.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {EmailMarketingComponent} from './email-marketing/email-marketing.component';
import {MatSelectModule} from '@angular/material';
import { EditTeamComponent } from './edit-team/edit-team.component';
import {EditTeamService} from './edit-team/edit-team.service';
import {TeamSizeResolver} from './edit-team/team-size.resolver';
import {TeamMembersResolver} from './edit-team/team-members.resolver';



@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatCardModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [
    BrandingComponent,
    EmailMarketingComponent,
    EditTeamComponent
  ],
  providers: [
    TeamMembersResolver,
    TeamSizeResolver,
    EditTeamService
  ]
})
export class AdminModule {

}
