import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '@/environments/environment';
import { OutboundHangerMonitoringComponent } from './outbound-hanger-monitoring.component';

const routes: Routes = [
  {
    path: 'wms/outboundhangermonitoring', // 出库衣架监控
    component: OutboundHangerMonitoringComponent,
    data: environment.routersData.wms['outboundhangermonitoring'],
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutboundHangerMonitoringRoutingModule { }
