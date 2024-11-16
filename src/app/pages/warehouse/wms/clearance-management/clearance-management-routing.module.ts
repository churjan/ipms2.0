import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { clearanceManagementComponent } from './clearance-management.component';
import { environment } from '../../../../../environments/environment';

const routes: Routes = [
  {
    path: 'wms/clearance-management',
    component: clearanceManagementComponent,
    data: environment.routersData.wms.stock
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class clearanceManagementRoutingModule { }
