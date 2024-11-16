import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgrammeComponent } from './programme.component';
import { ProgrammeRoutingModule } from './programme-routing.module';
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditComponent } from './edit/edit.component';
import { ConditionsComponent } from './edit/conditions/conditions.component';
import { StationsComponent } from './stations/stations.component';
import { PositionTransferComponent } from './position-transfer/position-transfer.component';

@NgModule({
  declarations: [ProgrammeComponent, EditComponent, ConditionsComponent, StationsComponent, PositionTransferComponent],
  imports: [
    CommonModule,
    ProgrammeRoutingModule,
    SharedModule,
    FormsModule, 
    ReactiveFormsModule
  ],
  exports: [
    ConditionsComponent
  ]
})
export class ProgrammeModule { }
