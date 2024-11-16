import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListShowModule } from './show/list-show.module';
import { classztreeModule } from './tree/class-ztree.module';
import { CrudModule } from './crud/crud.module';
import { CommFlowModule } from './comm-flow/comm-flow.module';
import { ImpModule } from './imp/imp.module';
import { HistoryFlowModule } from './history-flow/history-flow.module';
import { CommFlowOldModule } from './comm-flow-old/comm-flow-old.module';
import { CommFlowNewModule } from './comm-flow-new/comm-flow-new.module';
import { ReportShowModule } from './showReport/Report-show.module';
import { CommFlowthreeModule } from './comm-flow3/comm-flow3.module';
import { HistoryModule } from './history/history.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    ListShowModule,
    ReportShowModule,
    classztreeModule,
    CrudModule,
    CommFlowModule,
    CommFlowOldModule,
    CommFlowNewModule,
    ImpModule,
    HistoryFlowModule,
    HistoryModule,
    CommFlowthreeModule
  ]
})
export class CommonSubUnitModule { }
