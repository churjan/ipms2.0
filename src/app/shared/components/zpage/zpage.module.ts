import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ZorroAntdModule } from "~/shared/modules/zorro-antd.module";
import { PipesModule } from "~/shared/pipes/pipes.module";
import { SharedModule } from "~/shared/shared.module";
import { ZPageComponent } from "./zpage.component";

@NgModule({
    declarations: [ZPageComponent],
    imports: [
      CommonModule,
      ZorroAntdModule,
      PipesModule,
      FormsModule
    ],
    exports:[
        ZPageComponent
    ]
  })
  export class ZPageModule { }