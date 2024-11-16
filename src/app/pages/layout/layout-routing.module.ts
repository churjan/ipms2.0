import { environment } from '@/environments/environment';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FactoryManagementComponent } from './factory-management/factory-management.component';
import { HandStationComponent } from './HandStation/HandStation.component';
import { LayoutStructureDisplayComponent } from './layout-structure-display/layout-structure-display.component';
import { LayoutStructureManagementComponent } from './layout-structure-management/layout-structure-management.component';
import { PadRelationComponent } from './padrelation/padrelation.component';
import { StationSupervisoryControlComponent } from './stationSupervisoryControl/stationSupervisoryControl.component';
import { StructureRuleParamComponent } from './structure-rule-param/structure-rule-param.component';
import { StructureRuleSchemeComponent } from './structure-rule-scheme/structure-rule-scheme.component';
import { VirtualLayoutComponent } from './Virtual_Layout/Virtual_Layout.component';

const routes: Routes = [
  {
    path: 'layout/Factory',
    component: FactoryManagementComponent,
    data: environment.routersData.layout['Factory'],
  },
  {
    path: 'layout/layout-structure-display',
    component: LayoutStructureDisplayComponent,
    data: environment.routersData.layout['layout-structure-display']
  },
  {
    path: 'layout/exhibition',
    component: LayoutStructureManagementComponent,
    data: environment.routersData.layout['exhibition'],
  },
  {
    path: 'layout/padrelation',
    component: PadRelationComponent,
    data: environment.routersData.layout.padrelation
  },
  {
    path: 'layout/stationSupervisoryControl',
    component: StationSupervisoryControlComponent,
    //这里影响tab 标签的显示
    data: environment.routersData.layout.stationSupervisoryControl
  }, {
    path: 'layout/TacticalRules',
    component: StructureRuleParamComponent,
    data: environment.routersData.layout['TacticalRules'],
  },
  {
    path: 'layout/Programme',
    component: StructureRuleSchemeComponent,
    data: environment.routersData.layout['Programme'],
  },
  {
    path: 'layout/Virtual',
    component: VirtualLayoutComponent,
    data: environment.routersData.layout.Virtual
  },
  {
    path: 'layout/HandStation',
    component: HandStationComponent,
    data: environment.routersData.layout.HandStation
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRouting { }
