import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YieldSearchRoutingModule } from './yieldSearch-routing.module'
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {YieldSearchComponent } from './yieldSearch.component';

@NgModule({
  declarations: [YieldSearchComponent],
  imports: [
    CommonModule,
    YieldSearchRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class YieldSearchModule { }
