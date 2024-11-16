import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PackingProcessRoutingModule } from './packing-process-routing.module';
import { PackingProcessComponent } from './packing-process.component';
import { ScanPackingProcessComponent } from './scan-packing-process/scan-packing-process.component';

@NgModule({
  declarations: [PackingProcessComponent, ScanPackingProcessComponent],
  imports: [
    CommonModule,
    PackingProcessRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class packingProcessModule {}
