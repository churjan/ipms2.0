import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryClearanceManagementComponent } from './inventory-clearance-management.component';
import { environment } from '@/environments/environment';

const routes: Routes = [
  {
      path: 'wms/inventoryclearancemanagement',
      component: InventoryClearanceManagementComponent,
      data: environment.routersData.wms['inventoryclearancemanagement'],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryClearanceManagementRoutingModule { }
