import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InventoryOutboundRoutingModule } from './inventory-outbound-routing.module';
import { InventoryOutboundComponent } from './inventory-outbound.component';
import { OutboundTaskComponent } from './outbound-task/outbound-task.component';

@NgModule({
  declarations: [InventoryOutboundComponent, OutboundTaskComponent],
  imports: [CommonModule, InventoryOutboundRoutingModule, SharedModule, FormsModule, ReactiveFormsModule],
})
export class InventoryOutboundModule {}
