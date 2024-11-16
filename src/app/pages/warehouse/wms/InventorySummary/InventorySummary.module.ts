import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventorySummaryComponent } from './InventorySummary.component';
import { StockRoutingModule } from './InventorySummary-routing.module'
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagsModule } from '../../../pm/tags/tags.module';

@NgModule({
  declarations: [InventorySummaryComponent],
  imports: [
    CommonModule,
    StockRoutingModule,
    SharedModule,
    FormsModule, 
    ReactiveFormsModule,
    TagsModule
  ]
})
export class InventorySummaryModule { }
