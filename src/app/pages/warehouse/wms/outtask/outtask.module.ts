import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OuttaskComponent } from './outtask.component';
import { FilterComponent } from './filter/filter.component';
import { OuttaskRoutingModule } from './outtask-routing.module'
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OutControlModule } from '../outcontrol/outcontrol.module';

@NgModule({
  declarations: [OuttaskComponent, FilterComponent],
  imports: [
    CommonModule,
    OuttaskRoutingModule,
    SharedModule,
    FormsModule, 
    ReactiveFormsModule,
    OutControlModule
  ]
})
export class OuttaskModule { }
