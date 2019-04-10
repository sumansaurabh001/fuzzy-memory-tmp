import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ColorFieldComponent} from './color-field/color-field.component';
import {ColorPickerModule} from 'ngx-color-picker';
import {AdminRoutingModule} from '../admin/admin-routing.module';
import {MatButtonModule, MatCardModule, MatIconModule, MatInputModule, MatToolbarModule} from '@angular/material';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ColorPickerModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule
  ],
  declarations: [
    ColorFieldComponent
  ],
  exports: [ColorFieldComponent]
})
export class SharedModule { }
