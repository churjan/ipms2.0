import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { ListShowComponent } from './list-show.component';
import { ZorroAntdModule } from '~/shared/modules/zorro-antd.module';

@NgModule({
  declarations: [ListShowComponent],
  imports: [
    CommonModule,
    ZorroAntdModule,
    PipesModule,
  ],
  exports:[
    ListShowComponent
  ]
})
export class ListShowModule { }
