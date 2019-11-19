import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BrandingComponent} from './branding/branding.component';
import {EmailMarketingComponent} from './email-marketing/email-marketing.component';


const routes: Routes = [
  {
    path:'branding',
    component: BrandingComponent
  },
  {
    path: 'email-marketing',
    component: EmailMarketingComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {

}
