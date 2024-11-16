import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonSelectContent } from './input/common-select.component';
import { ZorroAntdModule } from '../modules/zorro-antd.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../pipes/pipes.module';
import { PublicZtreeSelectContent } from './tree/public-ztree-select.component';
import { CustomSelectContent } from './custom/custom-select.component';
import { DateSelectContent } from './date/date.component';
import { TableSelectContent } from './table/table-select.component';

@NgModule({
  declarations: [CommonSelectContent, PublicZtreeSelectContent, CustomSelectContent,DateSelectContent,TableSelectContent],
  imports: [
    CommonModule,
    ZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
  ],
  exports: [
    CommonSelectContent,
    PublicZtreeSelectContent,
    CustomSelectContent,
    DateSelectContent,
    TableSelectContent
  ]
})
export class SelectInputModule { }
