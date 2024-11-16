import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { ListShowModule } from '../show/list-show.module';
import { ZorroAntdModule } from '~/shared/modules/zorro-antd.module';
import { ComponentsModule } from '~/shared/components/components.module';
import { HistoryListComponent } from './History-list.component';
import { BackupsComponent } from './Backups/Backups.component';
import { CrudModule } from '../crud/crud.module';

@NgModule({
  declarations: [HistoryListComponent, BackupsComponent],
  imports: [
    CommonModule,
    ZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    ListShowModule,
    ComponentsModule,
    CrudModule
  ],
  exports: [
    HistoryListComponent, BackupsComponent
  ]
})
export class HistoryFlowModule { }
