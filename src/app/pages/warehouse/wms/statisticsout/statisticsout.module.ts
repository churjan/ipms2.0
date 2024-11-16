import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsoutComponent } from './statisticsout.component';
import { StatisticsoutRoutingModule } from './statisticsout-routing.module'
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterComponent } from './filter/filter.component';
import { SyncComponent } from './sync/sync.component';
import { TagsModule } from '../../../pm/tags/tags.module';

@NgModule({
  declarations: [StatisticsoutComponent, FilterComponent,SyncComponent],
  imports: [
    CommonModule,
    StatisticsoutRoutingModule,
    SharedModule,
    FormsModule, 
    ReactiveFormsModule,
    TagsModule
  ]
})
export class StatisticsoutModule { }
