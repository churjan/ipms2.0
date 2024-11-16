import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProcessDifficultyRoutingModule } from './process-difficulty-routing.module';
import { ProcessDifficultyComponent } from './process-difficulty.component';
import { EditProcessDifficultyComponent } from './edit-process-difficulty/edit-process-difficulty.component';
import { ViewProcessDifficultyComponent } from './view-process-difficulty/view-process-difficulty.component';


@NgModule({
  declarations: [
    ProcessDifficultyComponent,
    EditProcessDifficultyComponent,
    ViewProcessDifficultyComponent,
  ],
  imports: [
    CommonModule,
    ProcessDifficultyRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ProcessDifficultyModule { }
