import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { QualityItemManagementRoutingModule } from './quality-item-management-routing.module';
import { QualityItemManagementComponent } from './quality-item-management.component';
import { ViewQualityItemManagementComponent } from './view-quality-item-management/view-quality-item-management.component';
import { EditQualityItemManagementComponent } from './edit-quality-item-management/edit-quality-item-management.component';
import { QualityWithProcessComponent } from './quality-with-process/quality-with-process.component';
import { EditQualityItemManagementCatalogComponent } from './edit-quality-item-management-catalog/edit-quality-item-management-catalog.component';


@NgModule({
  declarations: [
    QualityItemManagementComponent,
    ViewQualityItemManagementComponent,
    EditQualityItemManagementComponent,
    QualityWithProcessComponent,
    EditQualityItemManagementCatalogComponent
  ],
  imports: [
    CommonModule,
    QualityItemManagementRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class QualityItemManagementModule { }
