import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "~/shared/shared.module";
import { FlowRoutingModule } from "./flow-routing.module";
import { FlowComponent } from "./flow.component";

@NgModule({
    declarations: [FlowComponent],
    imports: [
        FlowRoutingModule,
        CommonModule,
        SharedModule,
        FormsModule, 
        ReactiveFormsModule,
    ],
    exports:[
        FlowComponent,
    ]
})
export class FlowModule { }