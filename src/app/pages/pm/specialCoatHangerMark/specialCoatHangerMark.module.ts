import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpecialCoatHangerMarkComponent } from './specialCoatHangerMark.component';
import { SpecialCoatHangerMarkRoutingModule } from './specialCoatHangerMark-routing.module';

@NgModule({
  declarations: [SpecialCoatHangerMarkComponent],
  imports: [
    CommonModule,
    SpecialCoatHangerMarkRoutingModule,
    SharedModule,
    FormsModule, 
    ReactiveFormsModule
  ]
})
export class SpecialCoatHangerMarkModule { }
