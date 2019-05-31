import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ColorFieldComponent} from './color-field/color-field.component';
import {ColorPickerModule} from 'ngx-color-picker';
import {AdminRoutingModule} from '../admin/admin-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
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
