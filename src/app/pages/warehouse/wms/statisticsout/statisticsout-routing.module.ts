import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatisticsoutComponent } from './statisticsout.component';
import { environment } from '../../../../../environments/environment';

const routes: Routes = [
  {
    path: 'wms/statisticsout',
    component: StatisticsoutComponent,
    data: environment.routersData.wms.statisticsout
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticsoutRoutingModule { }
