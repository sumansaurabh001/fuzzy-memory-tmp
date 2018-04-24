import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { BrandingComponent } from './branding/branding.component';



@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule
  ],
  declarations: [BrandingComponent]
})
export class AdminModule {

}
