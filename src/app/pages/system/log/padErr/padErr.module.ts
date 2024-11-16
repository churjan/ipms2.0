import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PadErrComponent } from './padErr.component';
import { PadErrRoutingModule } from './padErr-routing.module';
import { PadErrInfoComponent } from './padErr-info/padErr-info.component';

@NgModule({
  declarations: [PadErrComponent,PadErrInfoComponent],
  imports: [
    CommonModule,
    PadErrRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PadErrModule { }
