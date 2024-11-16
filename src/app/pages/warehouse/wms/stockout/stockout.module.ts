import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockoutComponent } from './stockout.component';
import { StockoutRoutingModule } from './stockout-routing.module'
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  declarations: [StockoutComponent, DetailComponent],
  imports: [
    CommonModule,
    StockoutRoutingModule,
    SharedModule,
    FormsModule, 
    ReactiveFormsModule
  ]
})
export class StockoutModule { }
