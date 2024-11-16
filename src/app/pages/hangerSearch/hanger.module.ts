import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HangerRoutingModule } from './hanger-routing.module'
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HangerComponent } from './hanger.component';
import { ProInforComponent } from './pro_infor/pro_infor.component';
import { FlowInforComponent } from './flow_infor/flow_infor.component';
import { PartsInforComponent } from './parts_info/parts_info.component';
import { QualityCheckComponent } from './quality_check/quality_check.component';
import { AnswersListComponent } from './record/answers-list.component';

@NgModule({
  declarations: [HangerComponent, ProInforComponent, FlowInforComponent, PartsInforComponent, QualityCheckComponent, AnswersListComponent],
  imports: [
    CommonModule,
    HangerRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class HangerSearchModule { }
