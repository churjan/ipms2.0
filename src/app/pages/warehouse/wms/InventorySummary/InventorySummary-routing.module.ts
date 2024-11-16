import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventorySummaryComponent } from './InventorySummary.component';
import { environment } from '../../../../../environments/environment';

const routes: Routes = [
  {
    path: 'wms/InventorySummary',
    component: InventorySummaryComponent,
    data: environment.routersData.wms.InventorySummary
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockRoutingModule { }
