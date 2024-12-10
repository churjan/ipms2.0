import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryOutboundComponent } from './inventory-outbound.component';
import { environment } from '@/environments/environment';

const routes: Routes = [
  {
    path: 'wms/inventoryoutbound',
    component: InventoryOutboundComponent,
    data: environment.routersData.wms['inventoryoutbound'],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryOutboundRoutingModule {}
