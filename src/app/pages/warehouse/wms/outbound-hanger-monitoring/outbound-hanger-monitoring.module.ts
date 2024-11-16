import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OutboundHangerMonitoringRoutingModule } from './outbound-hanger-monitoring-routing.module';
import { OutboundHangerMonitoringComponent } from './outbound-hanger-monitoring.component';


@NgModule({
    declarations: [OutboundHangerMonitoringComponent],
    imports: [
        CommonModule,
        OutboundHangerMonitoringRoutingModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
    ],
})
export class OutboundHangerMonitoringModule {}
