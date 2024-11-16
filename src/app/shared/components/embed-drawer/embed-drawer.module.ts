import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmbedDrawerComponent } from './embed-drawer.component';
import { ZorroAntdModule } from '~/shared/modules/zorro-antd.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    EmbedDrawerComponent
  ],
  imports: [
    CommonModule,
    ZorroAntdModule,
    FormsModule, 
    ReactiveFormsModule,
  ],
  exports: [
    EmbedDrawerComponent
  ]
})
export class EmbedDrawerModule { }
