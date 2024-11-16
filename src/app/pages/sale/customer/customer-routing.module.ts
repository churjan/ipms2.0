import { environment } from '@/environments/environment';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer-list.component';

const routes: Routes = [
  {
    path: 'sale/customer',
    component: CustomerComponent,
    data: environment.routersData.sale.customer
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
