import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditComponent } from './edit/edit.component';
import { PartOperationComponent } from './partoperation.component';
import { PartOperationRoutingModule } from './partoperation-routing.module';


@NgModule({
  declarations: [PartOperationComponent, EditComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    PartOperationRoutingModule
  ], 
  exports: [
    PartOperationComponent,
    EditComponent
  ]
})
export class PartOperationModule { }
