import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImpComponent } from './imp.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { ListShowModule } from '../show/list-show.module';
import { ZorroAntdModule } from '~/shared/modules/zorro-antd.module';
import { ComponentsModule } from '~/shared/components/components.module';

@NgModule({
  declarations: [ImpComponent],
  imports: [
    CommonModule,
    ZorroAntdModule,
    FormsModule, 
    ReactiveFormsModule,
    PipesModule,
    ListShowModule,
    ComponentsModule
  ],
  exports:[
    ImpComponent
  ]
})
export class ImpModule { }
