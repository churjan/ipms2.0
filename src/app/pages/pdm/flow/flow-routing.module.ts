import { environment } from "@/environments/environment";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FlowComponent } from "./flow.component";

const routes: Routes = [
  {
    path: 'comm/flow',
    component: FlowComponent,
    //这里影响tab 标签的显示
    data: environment.routersData.comm.flow
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlowRoutingModule { }