import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FabricDifficultyRoutingModule } from './fabric-difficulty-routing.module';
import { FabricDifficultyComponent } from './fabric-difficulty.component';
import { ViewFabricDifficultyComponent } from './view-fabric-difficulty/view-fabric-difficulty.component';
import { EditFabricDifficultyComponent } from './edit-fabric-difficulty/edit-fabric-difficulty.component';
import { ImportFabricDifficultyComponent } from './import-fabric-difficulty/import-fabric-difficulty.component';


@NgModule({
  declarations: [
    FabricDifficultyComponent,
    ViewFabricDifficultyComponent,
    EditFabricDifficultyComponent,
    ImportFabricDifficultyComponent
  ],
  imports: [
    CommonModule,
    FabricDifficultyRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class FabricDifficultyModule { }
