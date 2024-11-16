import { environment } from "@/environments/environment";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HangerFlowComponent } from "./hangerFlow.component";

const routes: Routes = [
    {
      path: 'pm/hangerFlow',
      component: HangerFlowComponent,
      //这里影响tab 标签的显示
      data: environment.routersData.pm.hangerFlow
    }
];
  
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HangerFlowRoutingModule { }