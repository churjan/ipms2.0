import { environment } from "@/environments/environment";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SizeComponent } from "./size.component";

const routes: Routes = [
    {
      path: 'pdm/size',
      component: SizeComponent,
      //这里影响tab 标签的显示
      data: environment.routersData.pdm.size
    }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class SizeRoutingModule { }