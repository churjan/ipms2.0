import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from "echarts";
import { PipesModule } from '~/shared/pipes/pipes.module';
import { ZorroAntdModule } from '~/shared/modules/zorro-antd.module';
import { CommFlowComponent } from './comm-flow.component';
import { ComponentsModule } from '~/shared/components/components.module';
import { SelectInputModule } from '~/shared/selectInput/selectInput.module';
import { OpListComponent } from './opList/opList.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { WorkBalanceComponent } from './WorkBalance/WorkBalance.component';
import { ImpModule } from '../imp/imp.module';
import { PriceComponent } from './Price/Price.component';
import { OpListStyleComponent } from './opList-style/opList-style.component';
import { StationSetComponent } from './stationSet/stationSet.component';
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
  declarations: [CommFlowComponent, OpListComponent, WorkBalanceComponent,PriceComponent,OpListStyleComponent,StationSetComponent],
  exports: [
    CommFlowComponent, OpListComponent, WorkBalanceComponent,PriceComponent,OpListStyleComponent,StationSetComponent
  ]
})
export class CommFlowModule { }