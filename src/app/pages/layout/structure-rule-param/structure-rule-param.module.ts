import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StructureRuleParamRoutingModule } from './structure-rule-param-routing.module';

import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StructureRuleParamComponent } from './structure-rule-param.component';
import { StructureRuleParamTableListComponent } from './structure-rule-param-table-list/structure-rule-param-table-list.component';
import { EditStructureRuleParamComponent } from './structure-rule-param-table-list/edit-structure-rule-param/edit-structure-rule-param.component';
import { CustomTableComponent } from './structure-rule-param-table-list/edit-structure-rule-param/custom-table/custom-table.component';
import { ViewStructureRuleParamComponent } from './structure-rule-param-table-list/view-structure-rule-param/view-structure-rule-param.component';


@NgModule({
  declarations: [
    StructureRuleParamComponent,
    StructureRuleParamTableListComponent,
    EditStructureRuleParamComponent,
    CustomTableComponent,
    ViewStructureRuleParamComponent
  ],
  imports: [
    CommonModule,
    StructureRuleParamRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class StructureRuleParamModule { }
