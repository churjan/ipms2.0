import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AbnormalEventReportRoutingModule } from './abnormal-event-report-routing.module';
import { AbnormalEventReportComponent } from './abnormal-event-report.component';


@NgModule({
  declarations: [
    AbnormalEventReportComponent
  ],
  imports: [
    CommonModule,
    AbnormalEventReportRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class AbnormalEventReportModule { }
