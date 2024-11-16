import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from "echarts";
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { ZorroAntdModule } from '~/shared/modules/zorro-antd.module';
import { CommFlowOldComponent } from './comm-flow-old.component';
import { ComponentsModule } from '~/shared/components/components.module';
import { SelectInputModule } from '~/shared/selectInput/selectInput.module';
import { OpListComponent } from './opList/opList.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { WorkBalanceComponent } from './WorkBalance/WorkBalance.component';
import { ImpModule } from '../imp/imp.module';
import { PriceComponent } from './Price/Price.component';
@NgModule({
  imports: [
    CommonModule,
    ZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    ComponentsModule,
    ScrollingModule,
    SelectInputModule,
    DragDropModule,
    NgxEchartsModule.forRoot({ echarts }),
    ImpModule
  ],
  declarations: [CommFlowOldComponent, OpListComponent, WorkBalanceComponent,PriceComponent],
  exports: [
    CommFlowOldComponent, OpListComponent, WorkBalanceComponent,PriceComponent
  ]
})
export class CommFlowOldModule { }