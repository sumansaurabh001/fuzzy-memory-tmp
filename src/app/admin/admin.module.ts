import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { BrandingComponent } from './branding/branding.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';



@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatCardModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    SharedModule
  ],
  declarations: [
    BrandingComponent
  ]
})
export class AdminModule {

}
