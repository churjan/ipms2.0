import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InventoryClearanceManagementRoutingModule } from './inventory-clearance-management-routing.module';
import { InventoryClearanceManagementComponent } from './inventory-clearance-management.component';


@NgModule({
  declarations: [
    InventoryClearanceManagementComponent
  ],
  imports: [
    CommonModule,
    InventoryClearanceManagementRoutingModule,
    SharedModule,
    FormsModule, 
    ReactiveFormsModule,
  ]
})
export class InventoryClearanceManagementModule { }
