import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapacityComponent } from './capacity.component';
import { CapacityRoutingModule } from './capacity-routing.module'
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CapacityComponent],
  imports: [
    CommonModule,
    CapacityRoutingModule,
    SharedModule,
    FormsModule, 
    ReactiveFormsModule
  ]
})
export class CapacityModule { }
