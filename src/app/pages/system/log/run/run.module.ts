import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RunComponent } from './run.component';
import { RunRoutingModule } from './run-routing.module'
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterComponent } from './filter/filter.component';
import { FileLookComponent } from './look/filelook.component';

@NgModule({
  declarations: [RunComponent, FilterComponent,FileLookComponent],
  imports: [
    CommonModule,
    RunRoutingModule,
    SharedModule,
    FormsModule, 
    ReactiveFormsModule
  ]
})
export class RunModule { }
