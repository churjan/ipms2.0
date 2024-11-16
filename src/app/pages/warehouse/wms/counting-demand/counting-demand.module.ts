import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CountingDemandRoutingModule } from './counting-demand-routing.module';
import { CountingDemandComponent } from './counting-demand.component';


@NgModule({
  declarations: [
    CountingDemandComponent
  ],
  imports: [
    CommonModule,
    CountingDemandRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class CountingDemandModule { }
