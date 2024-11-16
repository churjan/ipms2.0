import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { ClassZtreeComponent } from './class-ztree.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ZorroAntdModule } from '~/shared/modules/zorro-antd.module';

@NgModule({
  declarations: [ClassZtreeComponent],
  imports: [
    CommonModule,
    ZorroAntdModule,
    PipesModule,
    HttpClientModule,
    FormsModule,
  ],
  exports:[
    ClassZtreeComponent,
  ]
})
export class classztreeModule { }
