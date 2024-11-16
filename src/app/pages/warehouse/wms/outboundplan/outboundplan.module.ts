import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OutboundPlanRoutingModule } from './outboundplan-routing.module'
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OutboundPlanComponent } from './outboundplan.component';
import { PlanEditComponent } from './planedit/planedit.component';
import { PlanLookComponent } from './planlook/planlook.component';

@NgModule({
  declarations: [OutboundPlanComponent,PlanEditComponent,PlanLookComponent],
  imports: [
    CommonModule,
    OutboundPlanRoutingModule,
    SharedModule,
    FormsModule, 
    ReactiveFormsModule
  ],
  exports:[
  ]
})
export class OutboundPlanModule { }
