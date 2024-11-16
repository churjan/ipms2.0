import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "~/shared/shared.module";
import { OrderSaleRoutingModule } from "./order-routing.module";
import { OrderSaleComponent } from "./order.component";

@NgModule({
    declarations: [OrderSaleComponent],
    imports: [
        OrderSaleRoutingModule,
        CommonModule,
        SharedModule,
        FormsModule, 
        ReactiveFormsModule
    ],
    exports:[
        OrderSaleComponent,
    ]
})
export class OrderSaleModule { }