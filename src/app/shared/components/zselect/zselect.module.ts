import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ZorroAntdModule } from "~/shared/modules/zorro-antd.module";
import { PipesModule } from "~/shared/pipes/pipes.module";
import { ZSelectComponent } from "./zselect.component";

@NgModule({
    declarations: [ZSelectComponent],
    imports: [
      CommonModule,
      ZorroAntdModule,
      PipesModule,
      FormsModule
    ],
    exports:[
        ZSelectComponent
    ]
  })
  export class ZSelectModule { }