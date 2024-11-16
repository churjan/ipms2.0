import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "~/shared/shared.module";
import { HangerFlowRoutingModule } from "./hangerFlow-routing.module";
import { HangerFlowComponent } from "./hangerFlow.component";

@NgModule({
    declarations: [HangerFlowComponent],
    imports: [
        HangerFlowRoutingModule,
        CommonModule,
        SharedModule,
        FormsModule, 
        ReactiveFormsModule,
    ],
    exports:[
        HangerFlowComponent,
    ]
})
export class HangerFlowModule { }