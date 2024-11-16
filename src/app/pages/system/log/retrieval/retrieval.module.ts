import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "~/shared/shared.module";
import { RetrievalDetailsComponent } from "./details/details.component";
import { RetrievalRoutingModule } from "./retrieval-routing.module";
import { RetrievalComponent } from "./retrieval.component";

@NgModule({
    declarations: [RetrievalComponent,RetrievalDetailsComponent],
    imports: [
        RetrievalRoutingModule,
        CommonModule,
        SharedModule,
        FormsModule, 
        ReactiveFormsModule
    ],
    exports:[
        RetrievalComponent,
    ]
})
export class RetrievalModule { }