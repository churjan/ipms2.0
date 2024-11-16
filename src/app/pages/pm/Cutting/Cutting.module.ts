import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CuttingRoutingModule } from './Cutting-routing.module';
import { CuttingComponent } from './Cutting.component';
import { CutClientComponent } from './client/CutClient.component';
import { EditComponent } from './edit/edit.component';
import { StyleFlow2Component } from './styleFlow/styleFlow.component';
import { FlowNew2Component } from './Flownew/Flownew.component';
import { EditBatchComponent } from './editBatch/editBatch.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    CuttingRoutingModule
  ],
  declarations: [CuttingComponent, CutClientComponent, EditComponent, StyleFlow2Component, FlowNew2Component,EditBatchComponent],

})
export class CuttingModule { }
