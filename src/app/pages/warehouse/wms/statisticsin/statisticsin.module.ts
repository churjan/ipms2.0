import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsinComponent } from './statisticsin.component';
import { StatisticsinRoutingModule } from './statisticsin-routing.module'
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterComponent } from './filter/filter.component';
import { SyncComponent } from './sync/sync.component';
import { TagsModule } from '../../../pm/tags/tags.module';

@NgModule({
  declarations: [StatisticsinComponent, FilterComponent,SyncComponent],
  imports: [
    CommonModule,
    StatisticsinRoutingModule,
    SharedModule,
    FormsModule, 
    ReactiveFormsModule,
    TagsModule
  ]
})
export class StatisticsinModule { }
