import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PadRelationComponent } from './padrelation.component';
import { PadrelationRoutingModule } from './padrelation-routing.module';
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [PadRelationComponent],
  imports: [
    CommonModule,
    SharedModule,
    PadrelationRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
  ]
})
export class PadrelationModule { }
