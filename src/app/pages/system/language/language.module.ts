import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LanguageComponent } from './language.component';
import { LanguageRoutingModule } from './language-routing.module';
import { EditComponent } from './version/edit/edit.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    LanguageRoutingModule
  ],
  declarations: [
    LanguageComponent,
    EditComponent
  ]
})
export class LanguageModule { }
