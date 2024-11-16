import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InoutsummaryreportComponent } from './inoutsummaryreport.component';
import { InoutsummaryreportRoutingModule } from './inoutsummaryreport-routing.module'
import { FilterComponent } from './filter/filter.component';
import { SharedModule } from '~/shared/shared.module';


@NgModule({
  declarations: [InoutsummaryreportComponent,FilterComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule, 
    ReactiveFormsModule,
    InoutsummaryreportRoutingModule
  ]
})
export class InoutsummaryreportModule { }
