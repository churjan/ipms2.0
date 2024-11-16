import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatisticsinComponent } from './statisticsin.component';
import { environment } from '../../../../../environments/environment';

const routes: Routes = [
  {
    path: 'wms/statisticsin',
    component: StatisticsinComponent,
    data: environment.routersData.wms.statisticsin
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticsinRoutingModule { }
