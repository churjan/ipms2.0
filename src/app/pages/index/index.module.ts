import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexRoutingModule } from './index-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '~/shared/shared.module';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';

import { IndexComponent } from './index.component';
@NgModule({
  imports: [
    CommonModule,
    IndexRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    SharedModule,
    NgxEchartsModule.forRoot({echarts})
  ],
  declarations: [
    IndexComponent,
  ]
})
export class IndexModule { }
