import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutStructureDisplayRoutingModule } from './layout-structure-display-routing.module';
import { LayoutStructureDisplayComponent } from './layout-structure-display.component';

import { NgxEchartsModule } from 'ngx-echarts';


@NgModule({
  declarations: [
    LayoutStructureDisplayComponent
  ],
  imports: [
    CommonModule,
    LayoutStructureDisplayRoutingModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ]
})
export class LayoutStructureDisplayModule { }
