import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmbedModalComponent } from './embed-modal.component';
import { ZorroAntdModule } from '~/shared/modules/zorro-antd.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    EmbedModalComponent
  ],
  imports: [
    CommonModule,
    ZorroAntdModule,
    FormsModule, 
    ReactiveFormsModule,
  ],
  exports: [
    EmbedModalComponent
  ]
})
export class EmbedModalModule { }
