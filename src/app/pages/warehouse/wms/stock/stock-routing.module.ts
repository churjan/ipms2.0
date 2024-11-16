import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockComponent } from './stock.component';
import { environment } from '../../../../../environments/environment';

const routes: Routes = [
  {
    path: 'wms/stock',
    component: StockComponent,
    data: environment.routersData.wms.stock
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockRoutingModule { }
