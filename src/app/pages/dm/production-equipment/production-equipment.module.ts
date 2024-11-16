import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProductionEquipmentRoutingModule } from './production-equipment-routing.module';
import { ProductionEquipmentComponent } from './production-equipment.component';
import { ViewProductionEquipmentComponent } from './view-production-equipment/view-production-equipment.component';
import { EditProductionEquipmentComponent } from './edit-production-equipment/edit-production-equipment.component';


@NgModule({
  declarations: [
    ProductionEquipmentComponent,
    ViewProductionEquipmentComponent,
    EditProductionEquipmentComponent,
  ],
  imports: [
    CommonModule,
    ProductionEquipmentRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ProductionEquipmentModule { }
