import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "~/shared/shared.module";
import { ColorRoutingModule } from "./color-routing.module";
import { ColorComponent } from "./color.component";

@NgModule({
    declarations: [ColorComponent],
    imports: [
        ColorRoutingModule,
        CommonModule,
        SharedModule,
        FormsModule, 
        ReactiveFormsModule,
    ],
    exports:[
        ColorComponent,
    ]
})
export class ColorModule { }