import { NgModule } from '@angular/core';
import { LayoutRouting } from './layout-routing.module';
import { VirtualLayoutModule } from './Virtual_Layout/Virtual_Layout.module';
import { StructureRuleSchemeModule } from './structure-rule-scheme/structure-rule-scheme.module';
import { StructureRuleParamModule } from './structure-rule-param/structure-rule-param.module';
import { StationSupervisoryControlModule } from './stationSupervisoryControl/stationSupervisoryControl.module';
import { ProgrammeModule } from './programme/programme.module';
import { PadrelationModule } from './padrelation/padrelation.module';
import { LayoutStructureManagementModule } from './layout-structure-management/layout-structure-management.module';
import { LayoutStructureDisplayModule } from './layout-structure-display/layout-structure-display.module';
import { FactoryManagementModule } from './factory-management/factory-management.module';
import { HandStationModule } from './HandStation/HandStation.module';


@NgModule({
  declarations: [
  ],
  imports: [
    VirtualLayoutModule,
    StructureRuleSchemeModule,
    StructureRuleParamModule,
    StationSupervisoryControlModule,
    ProgrammeModule,
    PadrelationModule,
    LayoutStructureManagementModule,
    LayoutStructureDisplayModule,
    FactoryManagementModule,
    HandStationModule,
    LayoutRouting
  ]
})
export class LayoutFormModule { }
