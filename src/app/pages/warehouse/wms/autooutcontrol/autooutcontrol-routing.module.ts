import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutooutcontrolComponent } from './autooutcontrol.component';
import { environment } from '../../../../../environments/environment';

const routes: Routes = [
  {
    path: 'wms/autooutcontrol',
    component: AutooutcontrolComponent,
    data: environment.routersData.wms.autooutcontrol
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutooutcontrolRoutingModule { }
