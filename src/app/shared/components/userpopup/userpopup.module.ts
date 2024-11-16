import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ZorroAntdModule } from "~/shared/modules/zorro-antd.module";
import { PipesModule } from "~/shared/pipes/pipes.module";
import { UserpopupComponent } from "./userpopup.component";

@NgModule({
    declarations: [UserpopupComponent],
    imports: [
      CommonModule,
      ZorroAntdModule,
      PipesModule,
      FormsModule
    ],
    exports:[
        UserpopupComponent
    ]
})
export class UserpopupModule { }