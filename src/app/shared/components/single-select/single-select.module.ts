import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ZorroAntdModule } from '~/shared/modules/zorro-antd.module';

import { SingleSelectComponent } from './single-select.component';
import { PipesModule } from '~/shared/pipes/pipes.module';

@NgModule({
    declarations: [SingleSelectComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ZorroAntdModule,
        PipesModule
    ],
    exports: [
      SingleSelectComponent
    ]
})
export class SingleSelectModule {}
