import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateComponent } from './translate.component';
import { TranslateRoutingModule } from './translate-routing.module';
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExportComponent } from './export/export.component';
import { ImportComponent } from './import/import.component';
@NgModule({
  declarations: [TranslateComponent, ExportComponent, ImportComponent],
  imports: [
    CommonModule,
    TranslateRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TranslateModule { }
