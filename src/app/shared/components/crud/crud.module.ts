import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudComponent } from './crud.component';
import { ZorroAntdModule } from '~/shared/modules/zorro-antd.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '~/shared/pipes/pipes.module';
import { TableModule } from '../table/table.module';

@NgModule({
  declarations: [CrudComponent],
  imports: [
    CommonModule,
    ZorroAntdModule,
    FormsModule, 
    ReactiveFormsModule,
    PipesModule,
    TableModule
  ],
  exports:[
    CrudComponent
  ]
})
export class CrudModule { }
