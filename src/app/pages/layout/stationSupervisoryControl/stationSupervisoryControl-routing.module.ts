import { environment } from "@/environments/environment";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { StationSupervisoryControlComponent } from "./stationSupervisoryControl.component";

const routes: Routes = [
    {
      path: 'layout/stationSupervisoryControl',
      component: StationSupervisoryControlComponent,
      //这里影响tab 标签的显示
      data: environment.routersData.layout.stationSupervisoryControl
    }
];
  
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StationSupervisoryControlRoutingModule { }