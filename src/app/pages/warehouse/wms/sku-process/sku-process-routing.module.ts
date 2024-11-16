import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkuProcessComponent } from './sku-process.component';
import { environment } from '@/environments/environment';

const routes: Routes = [
  {
    path: 'wms/skuprocess',
    component: SkuProcessComponent,
    data: environment.routersData.wms['skuprocess'],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SkuProcessRoutingModule {}
