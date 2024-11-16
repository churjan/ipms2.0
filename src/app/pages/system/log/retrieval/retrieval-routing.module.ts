import { environment } from "@/environments/environment";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RetrievalComponent } from "./retrieval.component";

const routes: Routes = [
    {
      path: 'sys/log/retrieval',
      component: RetrievalComponent,
      //这里影响tab 标签的显示
      data: environment.routersData.sys.log.retrieval
    }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class RetrievalRoutingModule { }