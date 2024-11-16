import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PadMonitorComponent } from './padMonitor.component';
import { InfeedDetailsComponent } from './InfeedDetails/InfeedDetails.component';


@NgModule({
  declarations: [
    PadMonitorComponent,
    InfeedDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PadMonitorModule { }
