import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { WeightmanagementRoutingModule } from './weightmanagement-routing.module';
import { WeightmanagementComponent } from './weightmanagement.component';


@NgModule({
  declarations: [WeightmanagementComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    WeightmanagementRoutingModule
  ]
})
export class WeightmanagementModule { }
