import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleComponent } from './role.component';
import { environment } from '../../../../environments/environment';

const routes: Routes = [
  {
    path: 'sys/role',
    component: RoleComponent,
    data: environment.routersData.sys.role
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule { }
