import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { BrandingComponent } from './branding/branding.component';
import {MatCardModule, MatInputModule, MatToolbarModule} from '@angular/material';



@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatCardModule,
    MatInputModule,
    MatToolbarModule
  ],
  declarations: [BrandingComponent]
})
export class AdminModule {

}
