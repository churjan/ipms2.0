import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StructureRuleSchemeComponent } from './structure-rule-scheme.component';
import { EditStructureRuleSchemeComponent } from './edit-structure-rule-scheme/edit-structure-rule-scheme.component';
import { TrackSelectTableComponent } from './track-config/track-select-table/track-select-table.component';
import { TrackUnselectTableComponent } from './track-config/track-unselect-table/track-unselect-table.component';
import { TrackTreeComponent } from './track-config/track-tree/track-tree.component';
import { TrackConfigComponent } from './track-config/track-config.component';

@NgModule({
  declarations: [
    StructureRuleSchemeComponent,
    // StructureRuleSchemeTableListComponent,
    EditStructureRuleSchemeComponent,
    TrackConfigComponent,
    TrackTreeComponent,
    TrackUnselectTableComponent,
    TrackSelectTableComponent
  ],
  exports: [
    EditStructureRuleSchemeComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class StructureRuleSchemeModule { }
