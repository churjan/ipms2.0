import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationComponent } from './organization.component';
import { environment } from '../../../../environments/environment';

const routes: Routes = [
  {
    path: 'hr/org',
    component: OrganizationComponent,
    data: environment.routersData.hr.org
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationRoutingModule { }
