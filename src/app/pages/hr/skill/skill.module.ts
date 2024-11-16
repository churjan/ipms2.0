import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "~/shared/shared.module";
import { SkillRoutingModule } from "./skill-routing.module";
import { SkillComponent } from "./skill.component";

@NgModule({
    declarations: [SkillComponent],
    imports: [
        SkillRoutingModule,
        CommonModule,
        SharedModule,
        FormsModule, 
        ReactiveFormsModule,
    ],
    exports:[
        SkillComponent,
    ]
})
export class SkillModule { }