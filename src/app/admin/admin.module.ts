import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { BrandingComponent } from './branding/branding.component';
import {MatButtonModule, MatCardModule, MatIconModule, MatInputModule, MatToolbarModule} from '@angular/material';
import {ColorPickerModule} from 'ngx-color-picker';
import {FormsModule} from '@angular/forms';



@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatCardModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    ColorPickerModule,
    MatIconModule,
    FormsModule
  ],
  declarations: [BrandingComponent]
})
export class AdminModule {

}
