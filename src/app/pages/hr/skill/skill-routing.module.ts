import { environment } from "@/environments/environment";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SkillComponent } from "./skill.component";

const routes: Routes = [
    {
      path: 'hr/skill',
      component: SkillComponent,
      //这里影响tab 标签的显示
      data: environment.routersData.hr.skill
    }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class SkillRoutingModule { }