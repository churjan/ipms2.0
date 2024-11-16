import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ZorroAntdModule } from "~/shared/modules/zorro-antd.module";
import { PipesModule } from "~/shared/pipes/pipes.module";
import { ZPopupComponent } from "./zpopup.component";
import { ZPopupConfirmComponent } from "./zpopupConfirm.component";

@NgModule({
    declarations: [ZPopupComponent,ZPopupConfirmComponent],
    imports: [
      CommonModule,
      ZorroAntdModule,
      PipesModule
    ],
    exports:[
        ZPopupComponent,
        ZPopupConfirmComponent
    ]
  })
  export class ZPopupModule { }