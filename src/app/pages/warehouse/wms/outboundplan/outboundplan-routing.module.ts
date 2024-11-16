import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OutboundPlanComponent } from './outboundplan.component';
import { environment } from 'src/environments/environment';

const routes: Routes = [
  {
    path: 'wms/outboundplan',
    component: OutboundPlanComponent,
    data: environment.routersData.wms.outboundplan
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutboundPlanRoutingModule { }
