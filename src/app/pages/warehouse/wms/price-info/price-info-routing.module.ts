import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PriceInfoComponent } from './price-info.component';
import { environment } from '@/environments/environment';

const routes: Routes = [
  {
      path: 'wms/priceinfo',
      component: PriceInfoComponent,
      data: environment.routersData.wms['priceinfo'],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PriceInfoRoutingModule { }
