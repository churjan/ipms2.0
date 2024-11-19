import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ZorroAntdModule } from '~/shared/modules/zorro-antd.module';
import { FilterByKeywordsPipe, DisplayLabelPipe } from './option-list.pipe';

import { InaSingleSelectComponent } from './ina-single-select.component';

@NgModule({
  declarations: [InaSingleSelectComponent, FilterByKeywordsPipe, DisplayLabelPipe],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ZorroAntdModule],
  exports: [InaSingleSelectComponent],
})
export class InaSingleSelectModule {}
