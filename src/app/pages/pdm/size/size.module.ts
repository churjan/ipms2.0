import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "~/shared/shared.module";
import { SizeRoutingModule } from "./size-routing.module";
import { SizeComponent } from "./size.component";

@NgModule({
    declarations: [SizeComponent],
    imports: [
        SizeRoutingModule,
        CommonModule,
        SharedModule,
        FormsModule, 
        ReactiveFormsModule,
    ],
    exports:[
        SizeComponent,
    ]
})
export class SizeModule { }