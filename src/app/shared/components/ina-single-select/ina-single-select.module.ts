import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ZorroAntdModule } from '~/shared/modules/zorro-antd.module';
import { PipesModule } from '~/shared/pipes/pipes.module';

import { InaSingleSelectComponent } from './ina-single-select.component';

@NgModule({
  declarations: [InaSingleSelectComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ZorroAntdModule, PipesModule],
  exports: [InaSingleSelectComponent],
})
export class InaSingleSelectModule {}
