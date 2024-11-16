import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "~/shared/shared.module";
import { StructureRuleSchemeModule } from "../structure-rule-scheme/structure-rule-scheme.module";
import { StationSupervisoryControlRoutingModule } from "./stationSupervisoryControl-routing.module";
import { StationSupervisoryControlComponent } from "./stationSupervisoryControl.component";

@NgModule({
    declarations: [StationSupervisoryControlComponent],
    imports: [
        StationSupervisoryControlRoutingModule,
        CommonModule,
        SharedModule,
        FormsModule, 
        ReactiveFormsModule,
        StructureRuleSchemeModule
    ],
    exports:[
        StationSupervisoryControlComponent,
    ]
})
export class StationSupervisoryControlModule { }