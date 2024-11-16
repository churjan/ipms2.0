import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProductionPartsRoutingModule } from './production-parts-routing.module';
import { ProductionPartsComponent } from './production-parts.component';
import { EditProductionPartsComponent } from './edit-production-parts/edit-production-parts.component';
import { ViewProductionPartsComponent } from './view-production-parts/view-production-parts.component';
import { PartSingletonComponent } from './PartSingleton/PartSingleton.component';

@NgModule({
  declarations: [
    ProductionPartsComponent,
    ViewProductionPartsComponent,
    EditProductionPartsComponent,
    PartSingletonComponent
  ],
  imports: [
    CommonModule,
    ProductionPartsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ProductionPartsModule { }
