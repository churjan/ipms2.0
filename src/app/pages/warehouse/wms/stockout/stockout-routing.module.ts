import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockoutComponent } from './stockout.component';
import { environment } from '../../../../../environments/environment';

const routes: Routes = [
  {
    path: 'wms/stockout',
    component: StockoutComponent,
    data: environment.routersData.wms.stockout
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockoutRoutingModule { }
