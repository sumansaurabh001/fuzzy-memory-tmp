import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BrandingComponent} from './branding/branding.component';
import {EmailMarketingComponent} from './email-marketing/email-marketing.component';
import {EditTeamComponent} from './edit-team/edit-team.component';
import {TeamSizeResolver} from './edit-team/team-size.resolver';
import {TeamMembersResolver} from './edit-team/team-members.resolver';


const routes: Routes = [
  {
    path:'branding',
    component: BrandingComponent
  },
  {
    path: 'email-marketing',
    component: EmailMarketingComponent
  },
  {
    path: 'edit-team',
    component: EditTeamComponent,
    resolve: {
      teamMembers: TeamMembersResolver,
      maxTeamSize: TeamSizeResolver
    }
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {

}
