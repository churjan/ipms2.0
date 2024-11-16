import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockComponent } from './stock.component';
import { StockRoutingModule } from './stock-routing.module'
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NumComponent } from './num/num.component';
import { OutComponent } from './out/out.component';
import { TagsModule } from '../../../pm/tags/tags.module';
import { CaltimeComponent } from './caltime/caltime.component';

@NgModule({
  declarations: [StockComponent, OutComponent, NumComponent, CaltimeComponent],
  imports: [
    CommonModule,
    StockRoutingModule,
    SharedModule,
    FormsModule, 
    ReactiveFormsModule,
    TagsModule
  ]
})
export class StockModule { }
