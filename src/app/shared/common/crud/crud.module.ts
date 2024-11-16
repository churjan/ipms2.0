import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudComponent } from './crud.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { ListShowModule } from '../show/list-show.module';
import { ZorroAntdModule } from '~/shared/modules/zorro-antd.module';
import { ImpModule } from '../imp/imp.module';
import { ReportShowModule } from '../showReport/Report-show.module';

@NgModule({
  declarations: [CrudComponent],
  imports: [
    CommonModule,
    ZorroAntdModule,
    FormsModule, 
    ReactiveFormsModule,
    PipesModule,
    ListShowModule,
    ReportShowModule,
    ImpModule
  ],
  exports:[
    CrudComponent
  ]
})
export class CrudModule { }
