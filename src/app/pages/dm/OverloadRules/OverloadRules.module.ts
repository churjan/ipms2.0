import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProductionPartsRoutingModule } from './OverloadRules-routing.module';
import { OverloadRulesComponent } from './OverloadRules.component';

@NgModule({
  declarations: [
    OverloadRulesComponent,
  ],
  imports: [
    CommonModule,
    ProductionPartsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class OverloadRulesModule { }
