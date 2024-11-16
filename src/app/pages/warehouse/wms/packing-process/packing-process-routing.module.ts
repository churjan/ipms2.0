import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PackingProcessComponent } from './packing-process.component';
import { environment } from '@/environments/environment';

const routes: Routes = [
  {
    path: 'wms/packingprocess',
    component: PackingProcessComponent,
    data: environment.routersData.wms['packingprocess'],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PackingProcessRoutingModule {}
