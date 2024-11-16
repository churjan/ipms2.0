import { environment } from '@/environments/environment';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverloadManagement } from './OverloadManagement.component';

const routes: Routes = [
  {
    path: 'pm/OverloadManagement',
    component: OverloadManagement,
    data: environment.routersData.pm.OverloadManagement
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OverloadManagementRoutingModule { }
