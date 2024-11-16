import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OutControlComponent } from './outcontrol.component';
import { environment } from 'src/environments/environment';

const routes: Routes = [
  {
    path: 'wms/outcontrol',
    component: OutControlComponent,
    data: environment.routersData.wms.outcontrol
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutControlRoutingModule { }
