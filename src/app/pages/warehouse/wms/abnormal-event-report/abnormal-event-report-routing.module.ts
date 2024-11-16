import { NgModule } from '@angular/core';


import { RouterModule, Routes } from '@angular/router';
import { AbnormalEventReportComponent } from './abnormal-event-report.component';
import { environment } from '@/environments/environment';

const routes: Routes = [
  {
    path: 'wms/abnormaleventreport',
    component: AbnormalEventReportComponent,
    data: environment.routersData.wms['abnormaleventreport'],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AbnormalEventReportRoutingModule { }
