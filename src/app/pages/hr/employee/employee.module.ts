import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeComponent } from './employee.component';
import { EmployeeRoutingModule } from './employee-routing.module'
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditComponent } from './edit/edit.component';
import { SettingComponent } from './setting/setting.component';
import { GroupComponent } from './group/group.component';
import { FilterComponent } from './filter/filter.component';

@NgModule({
  declarations: [EmployeeComponent, EditComponent, SettingComponent, GroupComponent, FilterComponent],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    SharedModule,
    FormsModule, 
    ReactiveFormsModule
  ]
})
export class EmployeeModule { }
