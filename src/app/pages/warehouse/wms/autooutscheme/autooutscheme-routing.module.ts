import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutooutschemeComponent } from './autooutscheme.component';
import { environment } from '../../../../../environments/environment';

const routes: Routes = [
  {
    path: 'wms/autooutscheme',
    component: AutooutschemeComponent,
    data: environment.routersData.wms.autooutscheme
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutooutschemeRoutingModule { }
