import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LayoutStructureManagementRoutingModule } from './layout-structure-management-routing.module';
import { LayoutStructureManagementComponent } from './layout-structure-management.component';
import { LayoutStructureManagementTableListComponent } from './layout-structure-management-table-list/layout-structure-management-table-list.component';
import { LayoutStructureManagementCatalogComponent } from './layout-structure-management-catalog/layout-structure-management-catalog.component';
import { LayoutStructureManagementDetailComponent } from './layout-structure-management-table-list/layout-structure-management-detail/layout-structure-management-detail.component';
import { StructurePropertyComponent } from './layout-structure-management-table-list/structure-property/structure-property.component';
import { BridgeShowComponent } from './layout-structure-management-table-list/bridge-show/bridge-show.component';
import { TabletModuleSettingComponent } from './layout-structure-management-table-list/tablet-module-setting/tablet-module-setting.component';
import { MachineDeviceComponent } from './layout-structure-management-table-list/machine-device/machine-device.component';
import { RuleSettingComponent } from './layout-structure-management-table-list/rule-setting/rule-setting.component';
import { WorkStationComponent } from './layout-structure-management-table-list/work-station/work-station.component';
import { EditLayoutStructureManagementCatalogComponent } from './layout-structure-management-catalog/edit-layout-structure-management-catalog/edit-layout-structure-management-catalog.component';
import { EditLayoutStructureManagementCapacityComponent } from './layout-structure-management-catalog/edit-layout-structure-management-capacity/edit-layout-structure-management-capacity.component';
import { SraComponent } from './layout-structure-management-table-list/sra/sra.component';
import { RuleInfoComponent } from './layout-structure-management-table-list/rule-setting/rule-info/rule-info.component';


@NgModule({
  declarations: [
    LayoutStructureManagementComponent,
    LayoutStructureManagementTableListComponent,
    LayoutStructureManagementCatalogComponent,
    LayoutStructureManagementDetailComponent,
    StructurePropertyComponent,
    BridgeShowComponent,
    TabletModuleSettingComponent,
    MachineDeviceComponent,
    RuleSettingComponent,
    WorkStationComponent,
    EditLayoutStructureManagementCatalogComponent,
    EditLayoutStructureManagementCapacityComponent,
    SraComponent,
    RuleInfoComponent
  ],
  imports: [
    CommonModule,
    LayoutStructureManagementRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class LayoutStructureManagementModule { }
