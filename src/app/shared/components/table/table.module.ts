import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table.component';
import { ZorroAntdModule } from '~/shared/modules/zorro-antd.module';
import { PipesModule } from '~/shared/pipes/pipes.module';

@NgModule({
  declarations: [TableComponent],
  imports: [
    CommonModule,
    ZorroAntdModule,
    PipesModule
  ],
  exports:[
    TableComponent
  ]
})
export class TableModule { }
