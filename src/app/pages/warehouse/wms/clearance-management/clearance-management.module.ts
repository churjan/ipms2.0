import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { clearanceManagementComponent } from './clearance-management.component';
import { clearanceManagementRoutingModule } from './clearance-management-routing.module'
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NumComponent } from './num/num.component';
import { OutComponent } from './out/out.component';
import { TagsModule } from '../../../pm/tags/tags.module';
import { CaltimeComponent } from './caltime/caltime.component';

@NgModule({
  declarations: [clearanceManagementComponent, OutComponent, NumComponent, CaltimeComponent],
  imports: [
    CommonModule,
    clearanceManagementRoutingModule,
    SharedModule,
    FormsModule, 
    ReactiveFormsModule,
    TagsModule
  ]
})
export class clearanceManagementModule { }
