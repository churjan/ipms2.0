import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HangersrecordComponent } from './Hangersrecord/Hangersrecord.component';
import { OperationDetailsComponent } from './Operationdetails/Operationdetails.component';
import { ReportFormRouting } from './reportForm-routing.module';
import { SalaryscheduleComponent } from './Salaryschedule/Salaryschedule.component';
import { QualityTrackingComponent } from './Qualitytracking/Qualitytracking.component';
import { StyleDataComponent } from './Styledata/Styledata.component';
import { YieldComponent } from './Yield/Yield.component';
import { InventoryStatisticsComponent } from './InventoryStatistics/InventoryStatistics.component';
import { ReworkStatisticsComponent } from './ReworkStatistics/ReworkStatistics.component';
import { YieldCustomComponent } from './Yield-Custom/Yield-Custom.component';
import { QualityTrackingCustomComponent } from './Qualitytracking-Custom/Qualitytracking-Custom.component';
import { ReworkStatisticsCustomComponent } from './ReworkStatistics-Custom/ReworkStatistics-Custom.component';
import { ExtendedReportComponent } from './ExtendedReport/ExtendedReport.component';
import { WHModule } from '../warehouse/wh/wh.module';


@NgModule({
  declarations: [
    HangersrecordComponent,
    OperationDetailsComponent,
    SalaryscheduleComponent,
    QualityTrackingComponent,
    StyleDataComponent,
    YieldComponent,
    InventoryStatisticsComponent,
    ReworkStatisticsComponent,
    YieldCustomComponent,
    QualityTrackingCustomComponent,
    ReworkStatisticsCustomComponent,
    ExtendedReportComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ReportFormRouting,
    WHModule
  ]
})
export class ReportFormModule { }
