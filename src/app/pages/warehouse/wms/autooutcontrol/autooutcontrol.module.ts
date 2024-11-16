import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutooutcontrolComponent } from './autooutcontrol.component';
import { AutooutcontrolRoutingModule } from './autooutcontrol-routing.module'
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditComponent } from './edit/edit.component';
import { FilterComponent } from './filter/filter.component';

@NgModule({
  declarations: [AutooutcontrolComponent, EditComponent, FilterComponent],
  imports: [
    CommonModule,
    AutooutcontrolRoutingModule,
    SharedModule,
    FormsModule, 
    ReactiveFormsModule,
  ]
})
export class AutooutcontrolModule { }
