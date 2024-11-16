import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawerComponent } from './drawer.component';
import { ZorroAntdModule } from '~/shared/modules/zorro-antd.module';

@NgModule({
  declarations: [DrawerComponent],
  imports: [
    CommonModule,
    ZorroAntdModule
  ],
  exports:[
    DrawerComponent
  ]
})
export class DrawerModule { }
