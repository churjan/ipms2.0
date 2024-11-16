import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayingClothRoutingModule } from './layingcloth-routing.module';
import { LayingClothComponent } from './layingcloth.component';
import { EditComponent } from './edit/edit.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    LayingClothRoutingModule,
  ],
  declarations: [LayingClothComponent,EditComponent],

})
export class LayingClothModule { }
