import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CopyrightComponent } from './copyright.component';
import { ZorroAntdModule } from '~/shared/modules/zorro-antd.module';

@NgModule({
  declarations: [CopyrightComponent],
  imports: [
    CommonModule,
    ZorroAntdModule
  ],
  exports:[
    CopyrightComponent
  ]
})
export class CopyrightModule { }
