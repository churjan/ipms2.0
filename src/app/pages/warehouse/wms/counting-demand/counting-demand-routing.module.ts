import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountingDemandComponent } from './counting-demand.component';
import { environment } from '@/environments/environment';

const routes: Routes = [
  {
    path: 'wms/countingdemand',
    component: CountingDemandComponent,
    data: environment.routersData.wms['countingdemand'],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CountingDemandRoutingModule { }
