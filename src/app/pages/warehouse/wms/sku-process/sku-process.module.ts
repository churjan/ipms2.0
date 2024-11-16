import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SkuProcessRoutingModule } from './sku-process-routing.module';
import { SkuProcessComponent } from './sku-process.component';
import { EditSkuProcessComponent } from './edit-sku-process/edit-sku-process.component';
import { ProgrammeModule } from '~/pages/layout/programme/programme.module';
import { WorkModule } from '~/pages/pm/Work/work.module';
import { SkuConditionComponent } from './edit-sku-process/sku-condition/sku-condition.component';
import { SectionListComponent } from './edit-sku-process/section-list/section-list.component';

@NgModule({
  declarations: [SkuProcessComponent, EditSkuProcessComponent, SkuConditionComponent, SectionListComponent],
  imports: [
    CommonModule,
    SkuProcessRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ProgrammeModule,
    WorkModule,
  ],
})
export class SkuProcessModule {}
