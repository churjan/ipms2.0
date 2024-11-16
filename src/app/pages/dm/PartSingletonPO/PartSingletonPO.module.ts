import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PartSingletonPORoutingModule } from './PartSingletonPO-routing.module';
import { PartSingletonPOComponent } from './PartSingletonPO.component';
import { EditPartSingletonPOComponent } from './edit/edit-PartSingletonPO.component';


@NgModule({
  declarations: [
    PartSingletonPOComponent,
    EditPartSingletonPOComponent
  ],
  imports: [
    CommonModule,
    PartSingletonPORoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PartSingletonPOModule { }
