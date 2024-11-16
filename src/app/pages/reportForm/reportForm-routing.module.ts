import { environment } from '@/environments/environment';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExtendedReportComponent } from './ExtendedReport/ExtendedReport.component';
import { HangersrecordComponent } from './Hangersrecord/Hangersrecord.component';
import { InventoryStatisticsComponent } from './InventoryStatistics/InventoryStatistics.component';
import { OperationDetailsComponent } from './Operationdetails/Operationdetails.component';
import { QualityTrackingCustomComponent } from './Qualitytracking-Custom/Qualitytracking-Custom.component';
import { QualityTrackingComponent } from './Qualitytracking/Qualitytracking.component';
import { ReworkStatisticsCustomComponent } from './ReworkStatistics-Custom/ReworkStatistics-Custom.component';
import { ReworkStatisticsComponent } from './ReworkStatistics/ReworkStatistics.component';
import { SalaryscheduleComponent } from './Salaryschedule/Salaryschedule.component';
import { StyleDataComponent } from './Styledata/Styledata.component';
import { YieldCustomComponent } from './Yield-Custom/Yield-Custom.component';
import { YieldComponent } from './Yield/Yield.component';

const routes: Routes = [
  {
    path: 'report/hangersrecord',
    component: HangersrecordComponent,
    data: environment.routersData.report.hangersrecord
  },
  {
    path: 'report/operationdetails',
    component: OperationDetailsComponent,
    data: environment.routersData.report.operationdetails
  },
  {
    path: 'report/qualitytracking',
    component: QualityTrackingComponent,
    data: environment.routersData.report.qualitytracking
  },
  {
    path: 'report/qualitytrackingCustom',
    component: QualityTrackingCustomComponent,
    data: environment.routersData.report.qualitytrackingCustom},
  {
    path: 'report/salaryschedule',
    component: SalaryscheduleComponent,
    data: environment.routersData.report.salaryschedule
  },
  {
    path: 'report/styledata',
    component: StyleDataComponent,
    data: environment.routersData.report.styledata
  },
  {
    path: 'report/yield',
    component: YieldComponent,
    data: environment.routersData.report.yield
  },
  {
    path: 'report/yieldCustom',
    component: YieldCustomComponent,
    data: environment.routersData.report.yieldCustom
  },
  {
    path: 'report/InventoryStatistics',
    component: InventoryStatisticsComponent,
    data: environment.routersData.report.InventoryStatistics
  },
  {
    path: 'report/ReworkStatistics',
    component: ReworkStatisticsComponent,
    data: environment.routersData.report.ReworkStatistics
  },{
    path:'report/ReworkStatisticsCustom',
    component:ReworkStatisticsCustomComponent,
    data: environment.routersData.report.ReworkStatisticsCustom
  },{
    path:'report/shiduanchanliang',
    component:ExtendedReportComponent,
    data: environment.routersData.report.shiduanchanliang
  },{
    path:'report/employeeProductivityCross',
    component:ExtendedReportComponent,
    data: environment.routersData.report.employeeProductivityCross
  },{
    path:'report/production',
    component:ExtendedReportComponent,
    data: environment.routersData.report.production
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportFormRouting { }
