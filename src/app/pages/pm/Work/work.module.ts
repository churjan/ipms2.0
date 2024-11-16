import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkComponent } from './work.component';
import { WorkRoutingModule } from './work-routing.module';
import { EditComponent } from './edit/edit.component';
import { SetTagsContent } from './setTags/setTags.component';
import { LookComponent } from './look/look.component';
import { HangInfoComponent } from './hanginfo/hanginfo.component';
import { FlowLaminationComponent } from './flowLamination/flowLamination.component';
import { SetTags2Content } from './setTags2/setTags2.component';


@NgModule({
  declarations: [WorkComponent,EditComponent,SetTagsContent,SetTags2Content,LookComponent,HangInfoComponent,FlowLaminationComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    WorkRoutingModule,
  ],
  exports: [
    FlowLaminationComponent
  ]
})
export class WorkModule { }
