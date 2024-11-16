import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InoutsummaryreportComponent } from './inoutsummaryreport.component';
import { environment } from '../../../../../environments/environment';

const routes: Routes = [
  {
    path: 'wms/inoutsummaryreport',
    component: InoutsummaryreportComponent,
    data: environment.routersData.wms.inoutsummaryreport
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InoutsummaryreportRoutingModule { }


