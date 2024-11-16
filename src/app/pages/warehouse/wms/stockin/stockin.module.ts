import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockinComponent } from './stockin.component';
import { StockinRoutingModule } from './stockin-routing.module'
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  declarations: [StockinComponent, DetailComponent],
  imports: [
    CommonModule,
    StockinRoutingModule,
    SharedModule,
    FormsModule, 
    ReactiveFormsModule
  ]
})
export class StockinModule { }
