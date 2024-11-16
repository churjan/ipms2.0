import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverloadManagementRoutingModule } from './OverloadManagement-routing.module';
import { OverloadManagement } from './OverloadManagement.component';
import { ControllerComponent } from './controller/controller.component';
import { HangerDetailComponent } from './hangerdetail/hangerdetail.component';
import { setGroupingComponent } from './setGrouping/setGrouping.component';
import { ProgrammeComponent } from './programme/programme.component';
import { ProgrammeEditComponent } from './programme/edit/programme-edit.component';
import { TrackConfigComponent } from './programme/track-config/track-config.component';
import { TrackUnselectTableComponent } from './programme/track-config/track-unselect-table/track-unselect-table.component';
import { TrackSelectTableComponent } from './programme/track-config/track-select-table/track-select-table.component';
import { TrackTreeComponent } from './programme/track-config/track-tree/track-tree.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    OverloadManagementRoutingModule
  ],
  declarations: [
    OverloadManagement,
    ControllerComponent,
    HangerDetailComponent,
    setGroupingComponent,
    ProgrammeComponent,
    ProgrammeEditComponent,
    TrackConfigComponent,
    TrackUnselectTableComponent,
    TrackSelectTableComponent,
    TrackTreeComponent
  ],

})
export class OverloadManagementModule { }
