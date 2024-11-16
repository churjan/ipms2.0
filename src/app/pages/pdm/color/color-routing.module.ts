import { environment } from "@/environments/environment";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ColorComponent } from "./color.component";

const routes: Routes = [
    {
      path: 'pdm/color',
      component: ColorComponent,
      //这里影响tab 标签的显示
      data: environment.routersData.pdm.color
    }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ColorRoutingModule { }