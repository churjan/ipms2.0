import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CapacityComponent } from './capacity.component';
import { environment } from '../../../../../environments/environment';

const routes: Routes = [
  {
    path: 'wms/capacity',
    component: CapacityComponent,
    data: environment.routersData.wms.capacity
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CapacityRoutingModule { }
