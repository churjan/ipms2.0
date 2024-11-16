import { environment } from '@/environments/environment';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InStorageComponent } from './inStorage/inStorage.component';
import { InventoryComponent } from './Inventory/Inventory.component';
import { OutboundComponent } from './Outbound/Outbound.component';
import { OutboundMonitoringComponent } from './OutboundMonitoring/OutboundMonitoring.component';
import { TaskOutComponent } from './TaskOut/TaskOut.component';

const routes: Routes = [
  {
    path: 'wh/warehousing',
    component: InStorageComponent,
    data: environment.routersData.wh.warehousing
  },
  {
    path: 'wh/inventory',
    component: InventoryComponent,
    data: environment.routersData.wh.inventory
  },
  {
    path: 'wh/outofstock',
    component: OutboundComponent,
    data: environment.routersData.wh.outofstock
  },
  {
    path: 'wh/OutboundMonitoring',
    component: OutboundMonitoringComponent,
    data: environment.routersData.wh.OutboundMonitoring
  },
  {
    path:'wh/TaskOut',
    component:TaskOutComponent,
    data: environment.routersData.wh.TaskOut
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class  whRoutingModule { }
