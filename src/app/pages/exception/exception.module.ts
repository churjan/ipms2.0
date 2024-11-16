import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExceptionComponent } from './exception.component';
import { ExceptionRoutingModule } from './exception-routing.module';
import { SharedModule } from '~/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ExceptionRoutingModule,
    SharedModule
  ],
  declarations: [
    ExceptionComponent
  ]
})
export class ExceptionModule { }
