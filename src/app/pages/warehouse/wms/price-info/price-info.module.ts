import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PriceInfoRoutingModule } from './price-info-routing.module';
import { PriceInfoComponent } from './price-info.component';
import { EditPriceInfoComponent } from './edit-price-info/edit-price-info.component';

@NgModule({
    declarations: [PriceInfoComponent, EditPriceInfoComponent],
    imports: [
        CommonModule,
        PriceInfoRoutingModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
    ],
})
export class PriceInfoModule {}
