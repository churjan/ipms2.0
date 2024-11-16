import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { whRoutingModule } from './wh-routing.module';
import { InStorageComponent } from './inStorage/inStorage.component';
import { InStorageEditComponent } from './inStorage/inStorageEdit/inStorageEdit.component';
import { InventoryComponent } from './Inventory/Inventory.component';
import { InventoryEditComponent } from './Inventory/InventoryEdit/InventoryEdit.component';
import { OutboundComponent } from './Outbound/Outbound.component';
import { OutboundEditComponent } from './Outbound/OutboundEdit/OutboundEdit.component';
import { OutboundMonitoringComponent } from './OutboundMonitoring/OutboundMonitoring.component';
import { MonitoringEditComponent } from './OutboundMonitoring/Monitoringedit/Monitoringedit.component';
import { TaskOutComponent } from './TaskOut/TaskOut.component';
import { TaskOutEditComponent } from './TaskOut/TaskOutEdit/TaskOutEdit.component';
import { LookComponent } from './TaskOut/look/look.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    whRoutingModule,
  ],
  declarations: [
    InStorageComponent,
    InStorageEditComponent,
    InventoryComponent,
    InventoryEditComponent,
    OutboundComponent,
    OutboundEditComponent,
    OutboundMonitoringComponent,
    MonitoringEditComponent,
    TaskOutComponent,
    TaskOutEditComponent,
    LookComponent],
  exports: [TaskOutEditComponent]
})
export class WHModule { }
