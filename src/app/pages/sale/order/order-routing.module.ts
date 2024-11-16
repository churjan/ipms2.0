import { environment } from "@/environments/environment";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OrderSaleComponent } from "./order.component";

const routes: Routes = [
    {
      path: 'sale/order',
      component: OrderSaleComponent,
      //这里影响tab 标签的显示
      data: environment.routersData.sale.order
    }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class OrderSaleRoutingModule { }