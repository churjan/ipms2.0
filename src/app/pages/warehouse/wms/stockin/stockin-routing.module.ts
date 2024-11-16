import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockinComponent } from './stockin.component';
import { environment } from '../../../../../environments/environment';

const routes: Routes = [
  {
    path: 'wms/stockin',
    component: StockinComponent,
    data: environment.routersData.wms.stockin
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockinRoutingModule { }
