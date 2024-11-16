import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import {ReportShowComponent } from './Report-show.component';
import { ZorroAntdModule } from '~/shared/modules/zorro-antd.module';

@NgModule({
  declarations: [ReportShowComponent],
  imports: [
    CommonModule,
    ZorroAntdModule,
    PipesModule,
  ],
  exports:[
    ReportShowComponent
  ]
})
export class ReportShowModule { }
