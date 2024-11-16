import { environment } from "@/environments/environment";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SpecialCoatHangerMarkComponent } from "./specialCoatHangerMark.component";

const routes: Routes = [
    {
      path: 'pm/specialCoatHangerMark',
      component: SpecialCoatHangerMarkComponent,
      data: environment.routersData.pm.specialCoatHangerMark
    }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class SpecialCoatHangerMarkRoutingModule { }