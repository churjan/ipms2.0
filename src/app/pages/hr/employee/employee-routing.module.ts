import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeComponent } from './employee.component';
import { environment } from '../../../../environments/environment';

const routes: Routes = [
  {
    path: 'hr/employee',
    component: EmployeeComponent,
    data: environment.routersData.hr.employee
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
