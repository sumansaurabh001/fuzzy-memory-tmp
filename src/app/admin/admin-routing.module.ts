import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BrandingComponent} from './branding/branding.component';


const routes: Routes = [
  {
    path:'branding',
    component: BrandingComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {

}
